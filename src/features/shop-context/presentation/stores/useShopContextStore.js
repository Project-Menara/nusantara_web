// useShopContextStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { mapFailureToMessage } from "@/core/error/map_failure_to_message";

// Import Repository & Use Cases
import { ShopContextRepository } from '../../data/repository/ShopContextRepository';
import { GetAvailableShopsUseCase } from '../../domain/use-case/GetAvailableShopsUseCase';
import { GetShopDetailsUseCase } from '../../domain/use-case/GetShopDetailsUseCase';
import { GetShopProductsUseCase } from '../../domain/use-case/GetShopProductsUseCase';

export const useShopContextStore = defineStore("shopContext", () => {
  // --- STATE ---
  
  /** Daftar toko yang bisa dipilih oleh kasir. (dari /cashier/shop-names) */
  const availableShops = ref([]);
  
  /** Detail toko yang sedang aktif. (dari /cashier/shop-cashier/:shop_id) */
  const currentShopDetails = ref(null);
  
  /** Daftar produk di toko yang sedang aktif. (dari /cashier/cashier-shop-product/:shop_id) */
  const currentShopProducts = ref([]);
  
  /** Status loading utama (untuk inisialisasi atau pergantian toko) */
  const isLoading = ref(false);
  
  /** Menandakan apakah konteks (daftar toko) sudah dimuat */
  const isContextLoaded = ref(false);
  
  /** Menandakan apakah kasir ini memiliki setidaknya satu toko */
  const hasAssignedShops = ref(false);
  
  /** ID toko yang sedang aktif */
  const activeShopId = computed(() => currentShopDetails.value?.id || null);

  // --- DEPENDENCIES ---
  const modalStore = useModalStore();
  const repository = new ShopContextRepository();
  const getAvailableShopsUseCase = new GetAvailableShopsUseCase(repository);
  const getShopDetailsUseCase = new GetShopDetailsUseCase(repository);
  const getShopProductsUseCase = new GetShopProductsUseCase(repository);

  // --- ACTIONS ---

  /**
   * Memilih toko baru dan memuat semua data terkait (detail & produk).
   * @param {string} shopId
   */
  async function selectShop(shopId) {
    if (!shopId) return;
    
    isLoading.value = true;
    
    // Gunakan Promise.all untuk mengambil data secara paralel
    const [detailsResult, productsResult] = await Promise.all([
      getShopDetailsUseCase.execute(shopId),
      getShopProductsUseCase.execute(shopId)
    ]);

    let hasError = false;

    // Proses hasil detail toko
    if (detailsResult.right) {
      currentShopDetails.value = detailsResult.right;
    } else {
      hasError = true;
      console.error("Gagal mengambil detail toko:", detailsResult.left);
      modalStore.openModal({
        newTitle: "Error Konteks Toko",
        newMessage: mapFailureToMessage(detailsResult.left),
        newStatus: "error",
      });
    }

    // Proses hasil produk toko
    if (productsResult.right) {
      currentShopProducts.value = productsResult.right;
    } else {
      hasError = true;
      console.error("Gagal mengambil produk toko:", productsResult.left);
      modalStore.openModal({
        newTitle: "Error Produk Toko",
        newMessage: mapFailureToMessage(productsResult.left),
        newStatus: "error",
      });
    }

    if (!hasError) {
      // Simpan pilihan yang valid ke localStorage
      localStorage.setItem("selected_shop_id", shopId);
    }
    
    isLoading.value = false;
  }

  /**
   * Menginisialisasi konteks toko untuk kasir.
   * Dipanggil satu kali setelah login atau saat refresh halaman.
   */
  async function initializeShopContext() {
    if (isContextLoaded.value) return; // Jangan jalankan dua kali

    isLoading.value = true;
    const shopsResult = await getAvailableShopsUseCase.execute();

    if (shopsResult.right && shopsResult.right.length > 0) {
      // BERHASIL: Kasir memiliki 1 atau lebih toko
      availableShops.value = shopsResult.right;
      hasAssignedShops.value = true;
      
      const savedShopId = localStorage.getItem("selected_shop_id");
      
      // Cek apakah toko yang disimpan masih valid
      const isValidSavedShop = availableShops.value.some(s => s.id === savedShopId);
      
      const shopIdToSelect = isValidSavedShop ? savedShopId : availableShops.value[0].id;

      // Memuat data untuk toko pertama atau toko yang disimpan
      await selectShop(shopIdToSelect);
      
    } else if (shopsResult.right) {
      // BERHASIL: Kasir tidak memiliki toko
      console.warn("Kasir ini tidak ditugaskan ke toko manapun.");
      hasAssignedShops.value = false;
      
    } else {
      // GAGAL: Error saat mengambil daftar toko
      hasAssignedShops.value = false;
      modalStore.openModal({
        newTitle: "Error Kritis",
        newMessage: mapFailureToMessage(shopsResult.left),
        newStatus: "error",
      });
    }

    isLoading.value = false;
    isContextLoaded.value = true;
  }
  
  /**
   * Membersihkan konteks saat logout.
   */
  function clearContext() {
    availableShops.value = [];
    currentShopDetails.value = null;
    currentShopProducts.value = [];
    isLoading.value = false;
    isContextLoaded.value = false;
    hasAssignedShops.value = false;
    localStorage.removeItem("selected_shop_id");
  }

  return {
    availableShops,
    currentShopDetails,
    currentShopProducts,
    isLoading,
    isContextLoaded,
    hasAssignedShops,
    activeShopId,
    initializeShopContext,
    selectShop,
    clearContext,
  };
});