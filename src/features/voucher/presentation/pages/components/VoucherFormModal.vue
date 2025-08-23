// File: src/features/voucher/presentation/components/VoucherFormModal.vue

<template>
  <BaseModal :isOpen="voucherStore.isFormModalOpen" @close="closeFormModal">
    <template #header>
      <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
        {{ isEditMode ? "Edit Voucher" : "Tambah Voucher" }}
      </DialogTitle>
    </template>

    <template #body>
      <div class="relative">
        <div v-if="isEditMode && voucherStore.isFormLoading" class="absolute inset-0 ...">
          <svg class="animate-spin h-8 w-8 ..."></svg>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="code" class="block text-sm font-medium mb-1">Kode Voucher</label>
              <input v-model="formData.code" type="text" id="code" class="form-input w-full" required />
            </div>

            <div>
              <label for="discountType" class="block text-sm font-medium mb-1">Tipe Diskon</label>
              <select v-model="formData.discountType" id="discountType" class="form-select w-full">
                <option value="percent">Persen</option>
                <option value="amount">Nominal</option>
              </select>
            </div>
          </div>

          <div v-if="formData.discountType === 'percent'">
            <label for="discountPercent" class="block text-sm font-medium mb-1">Persentase Diskon (%)</label>
            <input v-model.number="formData.discountPercent" type="number" id="discountPercent"
              class="form-input w-full" placeholder="Contoh: 10" />
          </div>

          <div v-if="formData.discountType === 'amount'">
            <label for="discountAmount" class="block text-sm font-medium mb-1">Jumlah Diskon (Rp)</label>
            <input :value="formattedDiscountAmount" @input="event => handleCurrencyInput(event, 'discountAmount')"
              type="text" id="discountAmount" class="form-input w-full" placeholder="Contoh: 25.000" />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium mb-1">Deskripsi</label>
            <SimpleEditor v-model="formData.description" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="minimumSpend" class="block text-sm font-medium mb-1">Minimal Belanja (Rp)</label>
              <!-- <input v-model.number="formData.minimumSpend" type="number" id="minimumSpend" class="form-input w-full" /> -->
              <input :value="formattedMinimumSpend" @input="event => handleCurrencyInput(event, 'minimumSpend')"
                type="text" id="minimumSpend" class="form-input w-full" />
            </div>

            <div>
              <label for="pointCost" class="block text-sm font-medium mb-1">Biaya Poin</label>
              <input v-model.number="formData.pointCost" type="number" id="pointCost" class="form-input w-full"
                placeholder="Contoh: 1500" />
            </div>

            <div>
              <label for="quota" class="block text-sm font-medium mb-1">Kuota</label>
              <input v-model.number="formData.quota" type="number" id="quota" class="form-input w-full" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="startDate" class="block text-sm font-medium mb-1">Tanggal Mulai</label>
              <flat-pickr v-model="formData.startDate" :config="dateConfig"
                class="form-input w-full bg-white dark:bg-gray-800" />
            </div>

            <div>
              <label for="endDate" class="block text-sm font-medium mb-1">Tanggal Berakhir</label>
              <flat-pickr v-model="formData.endDate" :config="dateConfig"
                class="form-input w-full bg-white dark:bg-gray-800" />
            </div>
          </div>
        </form>
      </div>
    </template>

    <!-- <template #footer>
      <button @click="closeFormModal" type="button" class="btn border-gray-300 ...">Batal</button>
      <div class="relative inline-block group">
        <button @click="handleSubmit" :disabled="voucherStore.isFormLoading" class="btn bg-violet-600 ...">
          <span v-if="voucherStore.isFormLoading">Menyimpan...</span>
          <span v-else>{{ isEditMode ? "Simpan Perubahan" : "Tambah" }}</span>
        </button>
      </div>
    </template> -->
    <template #footer>
      <button @click="closeFormModal" type="button" class="btn border-gray-300 ...">Batal</button>
      <div class="relative inline-block group"> <button @click="handleSubmit" :disabled="isButtonDisabled"
          class="btn bg-violet-600 hover:bg-violet-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
          <span v-if="voucherStore.isFormLoading">Menyimpan...</span>
          <span v-else>{{ isEditMode ? "Simpan Perubahan" : "Tambah" }}</span>
        </button>
        <span v-if="isButtonDisabled && !voucherStore.isFormLoading"
          class="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded-md shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300">
          {{ tooltipMessage }}
        </span>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useVoucherStore } from "../../stores/useVoucherStore";
import BaseModal from "@/components/modals/BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { Indonesian } from "flatpickr/dist/l10n/id.js";
import SimpleEditor from "@/components/forms/SimpleEditor.vue";
import { useCurrencyFormatter } from '@/composables/useCurrencyFormatter';

const voucherStore = useVoucherStore();

const isEditMode = computed(() => !!voucherStore.selectedVoucher?.id);

const formData = ref({});

const originalData = ref(null);

const dateConfig = {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  locale: Indonesian,
};

const resetForm = () => {
  formData.value = {
    code: "",
    discountType: "percent",
    discountPercent: 0,
    discountAmount: 0,
    description: "",
    minimumSpend: 0,
    pointCost: 0,
    quota: 0,
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
  };
};

const { handleCurrencyInput, createCurrencyComputed } = useCurrencyFormatter(formData);
const formattedMinimumSpend = createCurrencyComputed('minimumSpend');
const formattedDiscountAmount = createCurrencyComputed('discountAmount');

const isButtonDisabled = computed(() => {
  if (voucherStore.isFormLoading) {
    return true; // Selalu nonaktif saat loading
  }

  if (isEditMode.value) {
    // Mode Edit: nonaktif jika tidak ada perubahan
    // 1. Buat versi yang bisa dibandingkan dari kedua data
    const currentComparable = getComparableObject(formData.value);
    const originalComparable = getComparableObject(originalData.value);

    // 2. Bandingkan versi yang sudah dinormalisasi
    return JSON.stringify(currentComparable) === JSON.stringify(originalComparable);
  } else {
    // Mode Tambah: nonaktif jika ada field wajib yang kosong/nol
    const form = formData.value;
    if (!form.code || form.quota <= 0) {
      return true;
    }
    if (form.discountType === 'percent' && form.discountPercent <= 0) {
      return true;
    }
    if (form.discountType === 'amount' && form.discountAmount <= 0) {
      return true;
    }
    return false; // Jika semua valid, tombol aktif
  }
});

// FUNGSI BARU UNTUK MENYERAGAMKAN FORMAT TANGGAL
const getComparableObject = (data) => {
  if (!data) return null;
  // Salin semua properti, tapi khusus startDate dan endDate,
  // ubah menjadi format string ISO yang konsisten.
  return {
    ...data,
    startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
    endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
  };
};

const tooltipMessage = computed(() => {
  if (isEditMode.value) {
    return "Lakukan perubahan pada data voucher terlebih dahulu.";
  } else {
    return "Silakan lengkapi Kode, Kuota, dan Diskon.";
  }
});

// Watch untuk memuat data saat mode edit
watch(
  () => voucherStore.selectedVoucher,
  (newVoucher) => {
    if (newVoucher) {
      // Salin data voucher ke dalam formData dan originalData
      const dataToEdit = {
        code: newVoucher.code,
        discountType: newVoucher.discountType,
        discountPercent: newVoucher.discountPercent,
        discountAmount: newVoucher.discountAmount,
        description: newVoucher.description,
        minimumSpend: newVoucher.minimumSpend,
        quota: newVoucher.quota,
        pointCost: newVoucher.pointCost,
        startDate: newVoucher.startDate,
        endDate: newVoucher.endDate,
      };
      formData.value = { ...dataToEdit };
      originalData.value = { ...dataToEdit }; // Simpan salinan data asli
    }
  },
  { deep: true }
);

// Watch untuk mereset form saat modal dibuka untuk "Tambah Voucher"
watch(
  () => voucherStore.isFormModalOpen,
  (isOpen, wasOpen) => {
    // Hanya reset jika modal baru saja dibuka dan ini BUKAN mode edit
    if (isOpen && !wasOpen && !voucherStore.selectedVoucher) {
      resetForm(); // Kita tetap panggil resetForm untuk mode tambah
      originalData.value = null; // Pastikan data asli kosong
    }
  }
);
// watch(
//   () => voucherStore.selectedVoucher,
//   (newVoucher) => {
//     if (newVoucher) {
//       formData.value = {
//         code: newVoucher.code,
//         discountType: newVoucher.discountType,
//         discountPercent: newVoucher.discountPercent,
//         discountAmount: newVoucher.discountAmount,
//         description: newVoucher.description,
//         minimumSpend: newVoucher.minimumSpend,
//         quota: newVoucher.quota,
//         pointCost: newVoucher.pointCost,
//         startDate: newVoucher.startDate,
//         endDate: newVoucher.endDate,
//       };
//     }
//   }
// );

// watch(
//   () => voucherStore.isFormModalOpen,
//   (isOpen) => {
//     if (isOpen && !voucherStore.selectedVoucher) {
//       resetForm();
//     }
//   }
// );

const handleSubmit = () => {
  // const payload = {
  //   ...formData.value,
  //   start_date: new Date(formData.value.startDate).toISOString(),
  //   end_date: new Date(formData.value.endDate).toISOString(),
  //   status: 1,
  // };

  const payload = {
    code: formData.value.code,
    description: formData.value.description,
    quota: formData.value.quota,
    discount_type: formData.value.discountType, // ✅ Mapping dari camelCase ke snake_case
    minimum_spend: formData.value.minimumSpend,
    point_cost: formData.value.pointCost, // Format tanggal ke ISO String
    start_date: new Date(formData.value.startDate).toISOString(),
    end_date: new Date(formData.value.endDate).toISOString(), // Status hanya dikirim saat mode Tambah
    ...(!isEditMode.value && { status: 1 }),
  }; // Hapus properti yang tidak relevan // ✅ Logika diskon yang disempurnakan

  if (payload.discount_type === "percent") {
    payload.discount_percent = formData.value.discountPercent || 0;
    payload.discount_amount = 0;
  } else {
    // 'amount'
    payload.discount_amount = formData.value.discountAmount || 0;
    payload.discount_percent = 0;
  } // ✅ Status hanya ditambahkan saat mode Tambah

  if (!isEditMode.value) {
    payload.status = 1;
  } // Hapus properti camelCase // delete payload.discountAmount; // delete payload.discountPercent; // delete payload.minimumSpend; // delete payload.pointCost; // delete payload.startDate; // delete payload.endDate;

  voucherStore.submitVoucher(payload);
};

const closeFormModal = () => {
  voucherStore.isFormModalOpen = false;
};
</script>