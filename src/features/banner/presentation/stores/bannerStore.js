// bannerStore.js
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
  const searchQuery = ref("");
  // flag caching
  const hasFetched = ref(false);

  const isFormModalOpen = ref(false);
  const selectedBanner = ref(null);
  const isFormLoading = ref(false);
  const statusLoadingId = ref(null);
  const bannerList = computed(() => banners.value);

  const modalStore = useModalStore();
  const repository = new BannerRepository();
  const getBannersUseCase = new GetBannersUseCase(repository);
  const createBannerUseCase = new CreateBannerUseCase(repository);
  const getBannerByIdUseCase = new GetBannerByIdUseCase(repository);
  const updateBannerUseCase = new UpdateBannerUseCase(repository);
  const updateBannerStatusUseCase = new UpdateBannerStatusUseCase(repository);
  const deleteBannerUseCase = new DeleteBannerUseCase(repository);

  async function fetchBanners(page = 1, search = "") {
    searchQuery.value = search;
    isLoading.value = true;
    const result = await getBannersUseCase.execute(page, searchQuery.value);
    isLoading.value = false;

    if (result.right) {
      banners.value = result.right.banners;
      pagination.value = result.right.pagination;
    } else {
      const message = mapFailureToMessage(result.left);
      modalStore.openModal({
        newTitle: "Error",
        newMessage: message,
        newStatus: "error",
      });
    }
  }

  // Fungsi baru untuk pindah halaman
  async function changePage(page) {
    await fetchBanners(page, searchQuery.value);
  }

  async function openFormModal(bannerId = null) {
    // Selalu reset state terlebih dahulu
    selectedBanner.value = null;

    if (bannerId) {
      // ✅ Menggunakan pola "Show, then Load" agar konsisten
      isFormModalOpen.value = true;
      isFormLoading.value = true;
      const result = await getBannerByIdUseCase.execute(bannerId);
      isFormLoading.value = false;
      if (result.right) {
        selectedBanner.value = result.right;
      } else {
        isFormModalOpen.value = false;
        modalStore.openModal({
          newTitle: "Error",
          newMessage: mapFailureToMessage(result.left),
          newStatus: "error",
        });
      }
    } else {
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
      fetchBanners(pagination.value?.currentPage || 1, searchQuery.value);
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
      fetchBanners(pagination.value?.currentPage || 1, searchQuery.value);
    }
  }

  async function toggleBannerStatus(banner) {
    statusLoadingId.value = banner.id;
    const newStatusApi = banner.isActive ? 0 : 1;
    const result = await updateBannerStatusUseCase.execute(
      banner.id,
      newStatusApi
    );
    statusLoadingId.value = null;

    if (result.left) {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      // ✅ 4. Panggil fetchTypeProducts untuk revert tampilan jika gagal
      fetchBanners(pagination.value?.currentPage || 1, searchQuery.value);
    } else {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Status banner berhasil diperbarui.",
        newStatus: "success",
      });
      fetchBanners(pagination.value?.currentPage || 1, searchQuery.value);
    }
  }

  return {
    banners,
    pagination,
    isLoading,
    searchQuery,
    isFormModalOpen,
    selectedBanner,
    isFormLoading,
    bannerList,
    fetchBanners,
    openFormModal,
    submitBanner,
    removeBanner,
    toggleBannerStatus,
    changePage,
    statusLoadingId,
  };
});
