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
    }
  }

  async function openFormModal(bannerId = null) {
    isFormModalOpen.value = true;
    selectedBanner.value = null; // Reset
    if (bannerId) {
      isFormLoading.value = true;
      const result = await getBannerByIdUseCase.execute(bannerId);
      isFormLoading.value = false;
      if (result.right) {
        selectedBanner.value = result.right;
      }
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
      fetchBanners(pagination.value?.currentPage || 1);
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
      fetchBanners(pagination.value?.currentPage || 1);
    }
  }

  async function toggleBannerStatus(banner) {
    const newStatus = banner.isActive ? 0 : 1;
    const result = await updateBannerStatusUseCase.execute(
      banner.id,
      newStatus
    );

    if (result.left) {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    } else {
      // Refresh data untuk mendapatkan status terbaru
      fetchBanners(pagination.value?.currentPage || 1);
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
  };
});
