import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { TypeProductRepository } from "../../data/repository/TypeProductRepository";
import { GetTypeProductsUseCase } from "../../domain/use-case/GetTypeProductsUseCase";
import { CreateTypeProductUseCase } from "../../domain/use-case/CreateTypeProductsUseCase";
import { UpdateTypeProductUseCase } from "../../domain/use-case/UpdateTypeProductsUseCase";
import { DeleteTypeProductUseCase } from "../../domain/use-case/DeleteTypeProductsUseCase";
import { GetTypeProductByIdUseCase } from "../../domain/use-case/GetTypeProductsByIdUseCase";
import { UpdateTypeProductStatusUseCase } from "../../domain/use-case/UpdateTypeProductsStatusUseCase";
import { mapFailureToMessage } from "@/core/error/map_failure_to_message";
import {
  RateLimitFailure,
  IncorrectPasswordFailure,
} from "@/core/error/failure";

export const useTypeProductStore = defineStore("typeProduct", () => {
  // States
  const typeProducts = ref([]);
  const pagination = ref(null);
  const isLoading = ref(false);
  const isFormModalOpen = ref(false);
  const selectedTypeProduct = ref(null);
  const isFormLoading = ref(false);
  const searchQuery = ref("");
  const typeProductList = computed(() => typeProducts.value);

  // Dependencies
  const modalStore = useModalStore();
  const repository = new TypeProductRepository();
  const getTypeProductsUseCase = new GetTypeProductsUseCase(repository);
  const createTypeProductUseCase = new CreateTypeProductUseCase(repository);
  const getTypeProductByIdUseCase = new GetTypeProductByIdUseCase(repository);
  const updateTypeProductUseCase = new UpdateTypeProductUseCase(repository);
  const updateTypeProductStatusUseCase = new UpdateTypeProductStatusUseCase(
    repository
  );
  const deleteTypeProductUseCase = new DeleteTypeProductUseCase(repository);

  // Actions
  async function fetchTypeProducts(page = 1, search = "") {
    // ✅ Langsung set state pencarian agar selalu sinkron
    searchQuery.value = search;

    isLoading.value = true;
    const result = await getTypeProductsUseCase.execute(
      page,
      searchQuery.value
    );
    isLoading.value = false;
    if (result.left) {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    } else {
      typeProducts.value = result.right.typeProducts;
      pagination.value = result.right.pagination;
    }
  }

  async function changePage(page) {
    // ✅ PERBAIKAN: Kirim state searchQuery yang sedang aktif
    await fetchTypeProducts(page, searchQuery.value);
  }

  async function openFormModal(id = null) {
    selectedTypeProduct.value = null; // Selalu reset dulu

    if (id) {
      // --- Mode Edit ---

      // Buka Form
      isFormModalOpen.value = true;

      // Tampilkan loading sebelum mengambil data
      isFormLoading.value = true;

      const result = await getTypeProductByIdUseCase.execute(id);

      // Matikan Loading
      isFormLoading.value = false;

      if (result.right) {
        selectedTypeProduct.value = result.right;
        // isFormModalOpen.value = true; // Buka modal SETELAH data siap
      } else {
        isFormModalOpen.value = false;
        modalStore.openModal({
          newTitle: "Error",
          newMessage: mapFailureToMessage(result.left),
          newStatus: "error",
        });
      }
    } else {
      // --- Mode Tambah ---
      isFormModalOpen.value = true; // Langsung buka modal
    }
  }

  async function submitTypeProduct(formData) {
    isFormLoading.value = true;
    const isEditMode = !!selectedTypeProduct.value?.id;
    const useCase = isEditMode
      ? updateTypeProductUseCase
      : createTypeProductUseCase;
    const params = isEditMode
      ? [selectedTypeProduct.value.id, formData]
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
        newMessage: `Tipe Produk berhasil ${
          isEditMode ? "diperbarui" : "dibuat"
        }.`,
        newStatus: "success",
      });
      isFormModalOpen.value = false;
      // ✅ PERBAIKAN: Kirim state searchQuery yang sedang aktif
      fetchTypeProducts(pagination.value?.currentPage || 1, searchQuery.value);
    }
  }

  async function removeTypeProduct(id) {
    isLoading.value = true;
    const result = await deleteTypeProductUseCase.execute(id);
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
        newMessage: "Tipe Produk berhasil dihapus.",
        newStatus: "success",
      });
      // ✅ PERBAIKAN: Kirim state searchQuery yang sedang aktif
      fetchTypeProducts(pagination.value?.currentPage || 1, searchQuery.value);
    }
  }

  async function toggleStatus(item) {
    const originalStatus = item.isActive;
    const newStatus = originalStatus ? 0 : 1;
    const itemIndex = typeProducts.value.findIndex((tp) => tp.id === item.id);
    if (itemIndex !== -1)
      typeProducts.value[itemIndex].isActive = !originalStatus;

    const result = await updateTypeProductStatusUseCase.execute(
      item.id,
      newStatus
    );

    if (result.left) {
      if (itemIndex !== -1)
        typeProducts.value[itemIndex].isActive = originalStatus;
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    } else {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Status Tipe Produk berhasil diupdate.",
        newStatus: "success",
      });
      fetchTypeProducts(pagination.value?.currentPage || 1, searchQuery.value);
    }
  }

  return {
    typeProducts,
    pagination,
    isLoading,
    isFormModalOpen,
    searchQuery,
    selectedTypeProduct,
    isFormLoading,
    typeProductList,
    fetchTypeProducts,
    openFormModal,
    submitTypeProduct,
    removeTypeProduct,
    toggleStatus,
    changePage,
  };
});
