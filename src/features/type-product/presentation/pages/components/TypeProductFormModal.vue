<!-- TypeProductFormModal -->
<template>
  <BaseModal :isOpen="typeProductStore.isFormModalOpen" @close="closeFormModal">
    <template #header>
      <div class="text-center">
        <DialogTitle
          as="h3"
          class="text-2xl font-bold leading-6 text-gray-900 dark:text-white"
        >
          {{ isEditMode ? "Edit Tipe Produk" : "Tambah Tipe Produk" }}
        </DialogTitle>
        <p class="mt-2 text-sm text-gray-500">
          Lengkapi data tipe produk berikut.
        </p>
      </div>
    </template>
    <template #body>
      <div class="relative">
        <div
          v-if="isEditMode && typeProductStore.isFormLoading"
          class="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-10 rounded-lg"
        >
          <svg
            class="animate-spin h-8 w-8 text-[var(--color-violet-600)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <div v-if="isCropping">
          <ImageCropper
            :src="imageToCrop"
            :aspect-ratio="1 / 1"
            @crop="handleCrop"
            @cancel="cancelCrop"
          />
        </div>

        <form v-else @submit.prevent="handleSubmit" class="mt-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium mb-1"
                >Nama Tipe Produk</label
              >
              <input
                v-model="formData.name"
                type="text"
                id="name"
                class="form-input w-full"
                placeholder="Contoh: Pancake"
                required
                :disabled="typeProductStore.isFormLoading"
              />
            </div>
            <div>
              <label for="status" class="block text-sm font-medium mb-1"
                >Status</label
              >
              <select
                v-model="formData.status"
                id="status"
                class="form-select w-full disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                :disabled="isEditMode || typeProductStore.isFormLoading"
              >
                <option :value="true">Aktif</option>
                <option :value="false">Tidak Aktif</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Gambar</label>
            <label
              for="image-upload"
              class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700"
              :class="{
                'cursor-not-allowed bg-gray-100 dark:bg-gray-800':
                  typeProductStore.isFormLoading,
                'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600':
                  !typeProductStore.isFormLoading,
              }"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Klik untuk upload</span> atau
                  seret gambar
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG (MAX. 2MB)
                </p>
              </div>
              <input
                @change="handleFileChange"
                id="image-upload"
                type="file"
                class="hidden"
                accept="image/png, image/jpeg"
                :disabled="typeProductStore.isFormLoading"
              />
            </label>
            <div v-if="previewUrl" class="mt-2">
              <p class="text-sm font-medium mb-1">Preview:</p>
              <img
                :src="previewUrl"
                class="h-24 w-24 object-cover rounded-full shadow-sm border"
              />
            </div>
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      
      <button
        @click="closeFormModal"
        type="button"
        class="btn border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500"
      >
        Batal
      </button>
      <div class="relative inline-block group">
        <button
          :disabled="isButtonDisabled"
          @click="handleSubmit"
          class="btn bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span v-if="typeProductStore.isFormLoading" class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Menyimpan...
          </span>
          <span v-else>{{ isEditMode ? "Simpan Perubahan" : "Tambah" }}</span>
        </button>
        <span
          v-if="isButtonDisabled && !typeProductStore.isFormLoading"
          class="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded-md shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300"
        >
          {{ tooltipMessage }}
        </span>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useTypeProductStore } from "@/features/type-product/presentation/stores/typeProductStore";
import BaseModal from "@/components/modals/BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";
import ImageCropper from "@/components/ImageCropper.vue";

const typeProductStore = useTypeProductStore();

// ✅ isEditMode sekarang bisa ditentukan langsung dari keberadaan item yang dipilih
const isEditMode = computed(() => !!typeProductStore.selectedTypeProduct?.id);

const formData = ref({});
const selectedFile = ref(null);
const previewUrl = ref("");
const originalData = ref(null);
// ✅ 1. Tambahkan state baru
const isCropping = ref(false);
const imageToCrop = ref(null);
const imageCropperComponentRef = ref(null);

// ✅ PERBAIKAN UTAMA: Pantau 'selectedTypeProduct' untuk mengisi form
watch(
  () => typeProductStore.selectedTypeProduct,
  (newItem) => {
    if (newItem) {
      // --- Mode Edit: Berjalan HANYA SETELAH data datang ---
      const dataToEdit = { name: newItem.name, status: newItem.isActive };
      formData.value = { ...dataToEdit };
      originalData.value = { ...dataToEdit };
      previewUrl.value = newItem.image;
      selectedFile.value = null;
    }
  },
  { deep: true } // Gunakan deep watcher jika diperlukan
);

// ✅ Tambah watch terpisah untuk mereset form saat modal dibuka untuk "Tambah"
watch(
  () => typeProductStore.isFormModalOpen,
  (isOpen, wasOpen) => {
    // Hanya reset jika modal baru saja dibuka dan ini BUKAN mode edit
    if (isOpen && !wasOpen && !typeProductStore.selectedTypeProduct) {
      // --- Mode Tambah ---
      formData.value = { name: "", status: true };
      originalData.value = null;
      previewUrl.value = "";
      selectedFile.value = null;
    }
  }
);

const isButtonDisabled = computed(() => {
  if (typeProductStore.isFormLoading) return true;
  if (isEditMode.value) {
    const hasDataChanged =
      JSON.stringify(formData.value) !== JSON.stringify(originalData.value);
    const hasNewFile = !!selectedFile.value;
    return !hasDataChanged && !hasNewFile;
  } else {
    return !formData.value.name || !selectedFile.value;
  }
});

const tooltipMessage = computed(() => {
  if (isEditMode.value) {
    return "Lakukan perubahan terlebih dahulu.";
  } else {
    return "Silakan lengkapi nama dan gambar.";
  }
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // ✅ 2. Jangan langsung buat preview, tapi siapkan untuk cropping
  const reader = new FileReader();
  reader.onload = (e) => {
    imageToCrop.value = e.target.result;
    isCropping.value = true;
  };
  reader.readAsDataURL(file);

  // Kosongkan value input agar bisa memilih file yang sama lagi
  event.target.value = "";
};

// ✅ 3. Buat fungsi baru untuk menangani hasil crop
const handleCrop = (blob) => {
  const croppedFile = new File([blob], "cropped_image.jpg", {
    type: "image/jpeg",
  });
  selectedFile.value = croppedFile;
  previewUrl.value = URL.createObjectURL(blob);
  isCropping.value = false; // Kembali ke tampilan form
};

// ✅ Fungsi yang dipanggil dari footer dinamis
const cropImage = () => {
  if (!imageCropperComponentRef.value) return;
  const { canvas } = imageCropperComponentRef.value.getResult();
  if (canvas) {
    canvas.toBlob((blob) => {
      handleCrop(blob);
    });
  }
};

const cancelCrop = () => {
  isCropping.value = false;
  imageToCrop.value = null;
};

const handleSubmit = () => {
  if (isButtonDisabled.value) return;
  const data = new FormData();
  data.append("name", formData.value.name);

  // Hanya kirim status jika mode Tambah, karena di mode Edit status di-disable
  if (!isEditMode.value) {
    data.append("status", formData.value.status ? 1 : 0);
  }

  if (selectedFile.value) {
    data.append("image", selectedFile.value);
  }

  if (isEditMode.value) {
    data.append("_method", "PUT");
  }

  typeProductStore.submitTypeProduct(data);
};

const closeFormModal = () => {
  typeProductStore.isFormModalOpen = false;
};
</script>

<style scoped>
/* Helper class untuk tombol ikon */
/* .btn-icon {
  @apply h-8 w-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition;
} */
</style>
