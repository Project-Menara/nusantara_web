import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { VoucherRepository } from "../../data/repository/VoucherRepository";
import { GetVouchersUseCase } from "../../domain/use-case/GetVouchersUseCase";
import { CreateVoucherUseCase } from "../../domain/use-case/CreateVoucherUseCase";
import { UpdateVoucherUseCase } from "../../domain/use-case/UpdateVoucherUseCase";
import { DeleteVoucherUseCase } from "../../domain/use-case/DeleteVoucherUseCase";
import { GetVoucherByIdUseCase } from "../../domain/use-case/GetVoucherByIdUseCase";
import { UpdateVoucherStatusUseCase } from "../../domain/use-case/UpdateVoucherStatusUseCase";
import { mapFailureToMessage } from "@/core/error/map_failure_to_message";

export const useVoucherStore = defineStore("voucher", () => {
  const vouchers = ref([]);
  const pagination = ref(null);
  const isLoading = ref(false);
  const isFormModalOpen = ref(false);
  const selectedVoucher = ref(null);
  const isFormLoading = ref(false);
  const searchQuery = ref("");
  const statusLoadingId = ref(null);
  const voucherList = computed(() => vouchers.value);

  const modalStore = useModalStore();
  const repository = new VoucherRepository();
  const getVouchersUseCase = new GetVouchersUseCase(repository);
  const createVoucherUseCase = new CreateVoucherUseCase(repository);
  const getVoucherByIdUseCase = new GetVoucherByIdUseCase(repository);
  const updateVoucherUseCase = new UpdateVoucherUseCase(repository);
  const updateVoucherStatusUseCase = new UpdateVoucherStatusUseCase(repository);
  const deleteVoucherUseCase = new DeleteVoucherUseCase(repository);

  async function fetchVouchers(page = 1, search = "") {
    searchQuery.value = search;
    isLoading.value = true;
    const result = await getVouchersUseCase.execute(page, searchQuery.value);
    isLoading.value = false;

    if (result.right) {
      vouchers.value = result.right.vouchers;
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
    await fetchVouchers(page, searchQuery.value);
  }

  async function openFormModal(id = null) {
    selectedVoucher.value = null;
    if (id) {
      isFormModalOpen.value = true;
      isFormLoading.value = true;
      const result = await getVoucherByIdUseCase.execute(id);
      isFormLoading.value = false;
      if (result.right) {
        selectedVoucher.value = result.right;
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

  async function submitVoucher(formData) {
    isFormLoading.value = true;
    const isEditMode = !!selectedVoucher.value?.id;
    const useCase = isEditMode ? updateVoucherUseCase : createVoucherUseCase;
    const params = isEditMode
      ? [selectedVoucher.value.id, formData]
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
        newMessage: `Voucher berhasil ${isEditMode ? "diperbarui" : "dibuat"}.`,
        newStatus: "success",
      });
      isFormModalOpen.value = false;
      fetchVouchers(pagination.value?.currentPage || 1, searchQuery.value);
    }
  }

  async function removeVoucher(id) {
    isLoading.value = true;
    const result = await deleteVoucherUseCase.execute(id);
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
        newMessage: "Voucher berhasil dihapus.",
        newStatus: "success",
      });
      fetchVouchers(pagination.value?.currentPage || 1, searchQuery.value);
    }
  }

  async function toggleVoucherStatus(voucher) {
    statusLoadingId.value = voucher.id;
    const newStatusApi = voucher.isActive ? 0 : 1;
    const result = await updateVoucherStatusUseCase.execute(
      voucher.id,
      newStatusApi
    );
    statusLoadingId.value = null;

    if (result.left) {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      fetchVouchers(pagination.value?.currentPage || 1, searchQuery.value);
    } else {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Status voucher berhasil diperbarui.",
        newStatus: "success",
      });
      fetchVouchers(pagination.value?.currentPage || 1, searchQuery.value);
    }
  }

  return {
    vouchers,
    pagination,
    isLoading,
    isFormModalOpen,
    selectedVoucher,
    isFormLoading,
    searchQuery,
    statusLoadingId,
    voucherList,
    fetchVouchers,
    changePage,
    openFormModal,
    submitVoucher,
    removeVoucher,
    toggleVoucherStatus,
  };
});
