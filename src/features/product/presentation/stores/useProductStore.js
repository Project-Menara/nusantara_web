import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { ProductRepository } from "../../data/repository/ProductRepository";
import { GetProductsUseCase } from "../../domain/use-case/GetProductsUseCase";
import { CreateProductUseCase } from "../../domain/use-case/CreateProductUseCase";
import { UpdateProductUseCase } from "../../domain/use-case/UpdateProductUseCase";
import { DeleteProductUseCase } from "../../domain/use-case/DeleteProductUseCase";
import { GetProductByIdUseCase } from "../../domain/use-case/GetProductByIdUseCase";
import { UpdateProductStatusUseCase } from "../../domain/use-case/UpdateProductStatusUseCase";
import { mapFailureToMessage } from "@/core/error/map_failure_to_message";

export const useProductStore = defineStore("Product", () => {
  const products = ref([]);
  // const pagination = ref(null);
  const pagination = ref({
    currentPage: 1,
    perPage: 10,
    totalData: 0,
    totalPages: 1,
  });
  const isLoading = ref(false);
  const isFormModalOpen = ref(false);
  const selectedProduct = ref(null);
  const isFormLoading = ref(false);
  const searchQuery = ref("");
  const statusLoadingId = ref(null);
  const productList = computed(() => products.value);

  const modalStore = useModalStore();
  const repository = new ProductRepository();
  const getProductsUseCase = new GetProductsUseCase(repository);
  const createProductUseCase = new CreateProductUseCase(repository);
  const getProductByIdUseCase = new GetProductByIdUseCase(repository);
  const updateProductUseCase = new UpdateProductUseCase(repository);
  const updateProductStatusUseCase = new UpdateProductStatusUseCase(repository);
  const deleteProductUseCase = new DeleteProductUseCase(repository);

  async function fetchProducts(page = 1, search = "") {
    searchQuery.value = search;
    isLoading.value = true;
    const result = await getProductsUseCase.execute(page, searchQuery.value);
    isLoading.value = false;

    if (result.right) {
      products.value = result.right.products;
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
    await fetchProducts(page, searchQuery.value);
  }

  async function openFormModal(id = null) {
    selectedProduct.value = null;
    if (id) {
      isFormModalOpen.value = true;
      isFormLoading.value = true;
      const result = await getProductByIdUseCase.execute(id);
      isFormLoading.value = false;
      if (result.right) {
        selectedProduct.value = result.right;
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

  async function submitProduct(formData) {
    isFormLoading.value = true;
    const isEditMode = !!selectedProduct.value?.id;
    const useCase = isEditMode ? updateProductUseCase : createProductUseCase;
    const params = isEditMode
      ? [selectedProduct.value.id, formData]
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
        newMessage: `Product berhasil ${isEditMode ? "diperbarui" : "dibuat"}.`,
        newStatus: "success",
      });
      isFormModalOpen.value = false;
      setTimeout(() => {
        fetchProducts(pagination.value?.currentPage || 1, searchQuery.value);
      }, 2000);
      // fetchProducts(pagination.value?.currentPage || 1, searchQuery.value);
    }
  }

  async function removeProduct(id) {
    isLoading.value = true;
    const result = await deleteProductUseCase.execute(id);
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
        newMessage: "Product berhasil dihapus.",
        newStatus: "success",
      });
      fetchProducts(pagination.value?.currentPage || 1, searchQuery.value);
    }
  }

  async function toggleProductStatus(Product) {
    statusLoadingId.value = Product.id;
    const newStatusApi = Product.isActive ? 0 : 1;
    const result = await updateProductStatusUseCase.execute(
      Product.id,
      newStatusApi
    );
    statusLoadingId.value = null;

    if (result.left) {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      fetchProducts(pagination.value?.currentPage || 1, searchQuery.value);
    } else {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Status Product berhasil diperbarui.",
        newStatus: "success",
      });
      fetchProducts(pagination.value?.currentPage || 1, searchQuery.value);
    }
  }

  return {
    products,
    pagination,
    isLoading,
    isFormModalOpen,
    selectedProduct,
    isFormLoading,
    searchQuery,
    statusLoadingId,
    productList,
    fetchProducts,
    changePage,
    openFormModal,
    submitProduct,
    removeProduct,
    toggleProductStatus,
  };
});
