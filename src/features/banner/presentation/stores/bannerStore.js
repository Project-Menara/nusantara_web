import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { BannerRepository } from "../../data/repository/BannerRepository";
import { GetBannersUseCase } from "../../domain/use-cases/GetBannersUseCase";
import { mapFailureToMessage } from "@/core/error/map_failure_to_message";

export const useBannerStore = defineStore("banner", () => {
  const banners = ref([]);
  const pagination = ref(null);
  const isLoading = ref(false);

  // State baru untuk form
  const isFormModalOpen = ref(false);
  const selectedBanner = ref(null); // Untuk menampung data banner yang akan diedit
  const isFormLoading = ref(false);
  // Getter untuk memastikan data selalu reaktif untuk TanStack Table
  const bannerList = computed(() => banners.value);

  const modalStore = useModalStore();
  const repository = new BannerRepository();
  const getBannersUseCase = new GetBannersUseCase(repository);

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

  // Buat juga action untuk create, update, delete
  // async function deleteBanner(id) { ... }

  return { banners, pagination, isLoading, fetchBanners, bannerList };
});
