// useCashierStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { CashierRepository } from "../../data/repository/CashierRepository";
import { GetCashiersUseCase } from "../../domain/use-case/GetCashiersUseCase";
import { CreateCashierUseCase } from "../../domain/use-case/CreateCashierUseCase";
import { UpdateCashierUseCase } from "../../domain/use-case/UpdateCashierUseCase";
import { DeleteCashierUseCase } from "../../domain/use-case/DeleteCashierUseCase";
import { GetCashierByIdUseCase } from "../../domain/use-case/GetCashierByIdUseCase";
import { UpdateCashierStatusUseCase } from "../../domain/use-case/UpdateCashierStatusUseCase";
import { mapFailureToMessage } from "@/core/error/map_failure_to_message";

export const useCashierStore = defineStore("cashier", () => {
  // --- State ---
  const cashiers = ref([]);
  const pagination = ref({ currentPage: 1, totalPages: 1, totalData: 0 });
  const isLoading = ref(false);
  const isFormModalOpen = ref(false);
  const selectedCashier = ref(null);
  const isFormLoading = ref(false);
  const searchQuery = ref("");
  const statusLoadingId = ref(null);

  // --- Dependencies ---
  const modalStore = useModalStore();
  const repository = new CashierRepository();
  const getCashiersUseCase = new GetCashiersUseCase(repository);
  const createCashierUseCase = new CreateCashierUseCase(repository);
  const getCashierByIdUseCase = new GetCashierByIdUseCase(repository);
  const updateCashierUseCase = new UpdateCashierUseCase(repository);
  const updateCashierStatusUseCase = new UpdateCashierStatusUseCase(repository);
  const deleteCashierUseCase = new DeleteCashierUseCase(repository);

  // --- Actions ---

  async function fetchCashiers(page = 1, search = "") {
    searchQuery.value = search;
    isLoading.value = true;
    const result = await getCashiersUseCase.execute(page, searchQuery.value);
    isLoading.value = false;

    if (result.right) {
      console.log(result.right.pagination);
      cashiers.value = result.right.cashiers;
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
    await fetchCashiers(page, searchQuery.value);
  }

  async function openFormModal(id = null) {
    selectedCashier.value = null;
    isFormModalOpen.value = true;
    if (id) {
      isFormLoading.value = true;
      const result = await getCashierByIdUseCase.execute(id);
      isFormLoading.value = false;

      if (result.right) {
        selectedCashier.value = result.right;
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

  async function submitCashier(formData) {
    isFormLoading.value = true;
    const isEditMode = !!selectedCashier.value?.id;
    const useCase = isEditMode ? updateCashierUseCase : createCashierUseCase;
    const params = isEditMode
      ? [selectedCashier.value.id, formData]
      : [formData];

    const result = await useCase.execute(...params);
    isFormLoading.value = false;

    if (result.right) {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: `Kasir berhasil ${isEditMode ? "diperbarui" : "dibuat"}.`,
        newStatus: "success",
      });
      isFormModalOpen.value = false;
      fetchCashiers(pagination.value?.currentPage || 1, searchQuery.value);
    } else {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      throw result.left;
    }
  }

  async function removeCashier(id) {
    isLoading.value = true;
    const result = await deleteCashierUseCase.execute(id);
    isLoading.value = false;

    if (result.right) {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Kasir berhasil dihapus.",
        newStatus: "success",
      });
      fetchCashiers(pagination.value?.currentPage || 1, searchQuery.value);
    } else {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    }
  }

  async function toggleCashierStatus(cashier) {
    statusLoadingId.value = cashier.id;
    const newStatus = cashier.isActive ? 0 : 1;
    const result = await updateCashierStatusUseCase.execute(
      cashier.id,
      newStatus
    );
    statusLoadingId.value = null;

    if (result.right) {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Status Kasir berhasil diperbarui.",
        newStatus: "success",
      });
      fetchCashiers(pagination.value?.currentPage || 1, searchQuery.value);
    } else {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      fetchCashiers(pagination.value?.currentPage || 1, searchQuery.value);
    }
  }

  return {
    cashiers,
    pagination,
    isLoading,
    isFormModalOpen,
    selectedCashier,
    isFormLoading,
    searchQuery,
    statusLoadingId,
    fetchCashiers,
    changePage,
    openFormModal,
    submitCashier,
    removeCashier,
    toggleCashierStatus,
  };
});
