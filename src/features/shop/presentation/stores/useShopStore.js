import { defineStore } from "pinia";
import { ref } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { ShopRepository } from "../../data/repository/ShopRepository";
import { GetShopsUseCase } from "../../domain/use-case/GetShopsUseCase";
import { CreateShopUseCase } from "../../domain/use-case/CreateShopUseCase";
import { GetShopByIdUseCase } from "../../domain/use-case/GetShopByIdUseCase";
import { UpdateShopUseCase } from "../../domain/use-case/UpdateShopUseCase";
import { UpdateShopStatusUseCase } from "../../domain/use-case/UpdateShopStatusUseCase";
import { DeleteShopUseCase } from "../../domain/use-case/DeleteShopUseCase";
import { mapFailureToMessage } from "@/core/error/map_failure_to_message";

export const useShopStore = defineStore("shop", () => {
  // --- State ---
  const shops = ref([]);
  const pagination = ref({ currentPage: 1, totalPages: 1, totalData: 0 });
  const isLoading = ref(false);
  const isFormModalOpen = ref(false);
  const selectedShop = ref(null);
  const isFormLoading = ref(false);
  const searchQuery = ref("");
  const statusLoadingId = ref(null);

  // --- Dependencies ---
  const modalStore = useModalStore();
  const repository = new ShopRepository();
  const getShopsUseCase = new GetShopsUseCase(repository);
  const createShopUseCase = new CreateShopUseCase(repository);
  const getShopByIdUseCase = new GetShopByIdUseCase(repository);
  const updateShopUseCase = new UpdateShopUseCase(repository);
  const updateShopStatusUseCase = new UpdateShopStatusUseCase(repository);
  const deleteShopUseCase = new DeleteShopUseCase(repository);

  // --- Actions ---

  async function fetchShops(page = 1, search = "") {
    searchQuery.value = search;
    isLoading.value = true;
    const result = await getShopsUseCase.execute(page, searchQuery.value);
    isLoading.value = false;

    if (result.right) {
      shops.value = result.right.shops;
      pagination.value = result.right.pagination;
    } else {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    }
  }

  async function changePage(page) {
    await fetchShops(page, searchQuery.value);
  }

  async function openFormModal(id = null) {
    selectedShop.value = null;
    isFormModalOpen.value = true;
    if (id) {
      isFormLoading.value = true;
      const result = await getShopByIdUseCase.execute(id);
      isFormLoading.value = false;

      if (result.right) {
        selectedShop.value = result.right;
      } else {
        isFormModalOpen.value = false;
        modalStore.openModal({
          newTitle: "Error",
          newMessage: mapFailureToMessage(result.left),
          newStatus: "error",
        });
      }
    }
  }

  async function submitShop(formData) {
    isFormLoading.value = true;
    const isEditMode = !!selectedShop.value?.id;
    const useCase = isEditMode ? updateShopUseCase : createShopUseCase;
    const params = isEditMode
      ? [selectedShop.value.id, formData]
      : [formData];

    const result = await useCase.execute(...params);
    isFormLoading.value = false;

    if (result.right) {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: `Toko berhasil ${isEditMode ? "diperbarui" : "dibuat"}.`,
        newStatus: "success",
      });
      isFormModalOpen.value = false;
      // Beri jeda agar server sempat memproses file sebelum fetch ulang
      setTimeout(() => {
        fetchShops(pagination.value?.currentPage || 1, searchQuery.value);
      }, 1000);
    } else {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      throw result.left;
    }
  }

  async function removeShop(id) {
    isLoading.value = true;
    const result = await deleteShopUseCase.execute(id);
    isLoading.value = false;

    if (result.right) {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Toko berhasil dihapus.",
        newStatus: "success",
      });
      fetchShops(pagination.value?.currentPage || 1, searchQuery.value);
    } else {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    }
  }

  async function toggleShopStatus(shop) {
    statusLoadingId.value = shop.id;
    const newStatus = shop.isActive ? 0 : 1;
    const result = await updateShopStatusUseCase.execute(shop.id, newStatus);
    statusLoadingId.value = null;

    if (result.right) {
        // Optimistic update: langsung ubah state di frontend
        const index = shops.value.findIndex(s => s.id === shop.id);
        if (index !== -1) {
            shops.value[index].isActive = !shops.value[index].isActive;
        }
    } else {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    }
  }

  return {
    shops, pagination, isLoading, isFormModalOpen, selectedShop,
    isFormLoading, searchQuery, statusLoadingId,
    fetchShops, changePage, openFormModal, submitShop, removeShop, toggleShopStatus,
  };
});
