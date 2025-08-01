import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { BannerRepository } from "../../data/repository/BannerRepository";
import { GetBannersUseCase } from "../../domain/use-cases/GetBannersUseCase";
import { CreateBannerUseCase } from "../../domain/use-cases/CreateBannerUseCase";
import { UpdateBannerStatusUseCase } from "../../domain/use-cases/UpdateBannerStatusUseCase";
import { UpdateBannerUseCase } from "../../domain/use-cases/UpdateBannerUseCase";
import { DeleteBannerUseCase } from "../../domain/use-cases/DeleteBannerUseCase";
import { GetBannerByIdUseCase } from "../../domain/use-cases/GetBannerByIdUseCase";
import { mapFailureToMessage } from "@/core/error/map_failure_to_message";

export const useBannerStore = defineStore("banner", () => {
  const banners = ref([]);
  const pagination = ref(null);
  const isLoading = ref(false);
  // flag caching
  const hasFetched = ref(false);

  const isFormModalOpen = ref(false);
  const selectedBanner = ref(null);
  const isFormLoading = ref(false);
  const bannerList = computed(() => banners.value);

  const modalStore = useModalStore();
  const repository = new BannerRepository();
  const getBannersUseCase = new GetBannersUseCase(repository);
  const createBannerUseCase = new CreateBannerUseCase(repository);
  const getBannerByIdUseCase = new GetBannerByIdUseCase(repository);
  const updateBannerUseCase = new UpdateBannerUseCase(repository);
  const updateBannerStatusUseCase = new UpdateBannerStatusUseCase(repository);
  const deleteBannerUseCase = new DeleteBannerUseCase(repository);

  async function fetchBanners(page = 1) {
    // PERBAIKAN: Hanya cek cache jika halamannya sama dengan yang ada di state
    const currentPage = pagination.value?.currentPage || 0;
    if (hasFetched.value && page === currentPage) {
      return;
    }

    isLoading.value = true;
    const result = await getBannersUseCase.execute(page);
    isLoading.value = false;

    if (result.left) {
      const message = mapFailureToMessage(result.left);
      modalStore.openModal({
        newTitle: "Error",
        newMessage: message,
        newStatus: "error",
      });
    } else {
      banners.value = result.right.banners;
      pagination.value = result.right.pagination;
      hasFetched.value = true;
    }
  }

  // Fungsi baru untuk pindah halaman
  async function changePage(page) {
    // PERBAIKAN: Tidak perlu cek kondisi di sini, biarkan fetchBanners yang menangani
    await fetchBanners(page);
  }

  // 4. Buat fungsi untuk memaksa fetch ulang (misal: setelah create/delete)
  async function forceRefreshBanners() {
    hasFetched.value = false;
    // PERBAIKAN: Ambil halaman saat ini atau halaman pertama
    const currentPage = pagination.value?.currentPage || 1;
    await fetchBanners(currentPage);
  }

  async function openFormModal(bannerId = null) {
    // Selalu reset state terlebih dahulu
    selectedBanner.value = null;

    if (bannerId) {
      // --- MODE EDIT ---
      isFormLoading.value = true;
      const result = await getBannerByIdUseCase.execute(bannerId);
      isFormLoading.value = false;

      if (result.right) {
        selectedBanner.value = result.right;
        // Buka modal HANYA setelah data berhasil didapatkan
        isFormModalOpen.value = true;
      } else {
        // Jika gagal mengambil data, tampilkan error dan jangan buka modal
        modalStore.openModal({
          newTitle: "Error",
          newMessage: mapFailureToMessage(result.left),
          newStatus: "error",
        });
      }
    } else {
      // --- MODE TAMBAH ---
      // Langsung buka modal karena tidak perlu mengambil data
      isFormModalOpen.value = true;
    }
  }

  async function submitBanner(formData) {
    isFormLoading.value = true;
    const isEditMode = !!selectedBanner.value?.id;
    const useCase = isEditMode ? updateBannerUseCase : createBannerUseCase;
    const params = isEditMode
      ? [selectedBanner.value.id, formData]
      : [formData];
    const result = await useCase.execute(...params);
    isFormLoading.value = false;

    if (result.left) {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      throw result.left;
    } else {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: `Banner berhasil ${isEditMode ? "diperbarui" : "dibuat"}.`,
        newStatus: "success",
      });
      isFormModalOpen.value = false;
      // PERBAIKAN: Gunakan forceRefreshBanners
      forceRefreshBanners();
    }
  }

  async function removeBanner(bannerId) {
    isLoading.value = true;
    const result = await deleteBannerUseCase.execute(bannerId);
    isLoading.value = false;

    if (result.left) {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    } else {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Banner berhasil dihapus.",
        newStatus: "success",
      });
      // PERBAIKAN: Gunakan forceRefreshBanners
      forceRefreshBanners();
    }
  }

  async function toggleBannerStatus(banner) {
    const originalStatus = banner.isActive;
    const bannerIndex = banners.value.findIndex((b) => b.id === banner.id);
    if (bannerIndex === -1) return;

    banners.value[bannerIndex].isActive = !originalStatus;

    const newStatusApi = originalStatus ? 0 : 1;
    const result = await updateBannerStatusUseCase.execute(
      banner.id,
      newStatusApi
    );

    if (result.left) {
      banners.value[bannerIndex].isActive = originalStatus; // Revert

      modalStore.openModal({
        newTitle: "Update Gagal",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    } else {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Status banner berhasil diperbarui.",
        newStatus: "success",
      });
    }
  }

  return {
    banners,
    pagination,
    isLoading,
    isFormModalOpen,
    selectedBanner,
    isFormLoading,
    bannerList,
    fetchBanners,
    openFormModal,
    submitBanner,
    removeBanner,
    toggleBannerStatus,
    forceRefreshBanners,
    changePage,
  };
});
