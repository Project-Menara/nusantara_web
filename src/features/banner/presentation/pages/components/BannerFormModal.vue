<!-- bannerFormModal -->
<template>
  <BaseModal :isOpen="bannerStore.isFormModalOpen" @close="closeFormModal">
    <template #header>
      <div class="text-center">
        <DialogTitle
          as="h3"
          class="text-2xl font-bold leading-6 text-gray-900 dark:text-white"
        >
          {{ isEditMode ? "Edit Banner" : "Tambah Banner" }}
        </DialogTitle>
        <p class="mt-2 text-sm text-gray-500">
          Lengkapi data banner berikut untuk ditampilkan di aplikasi. Gunakan
          gambar yang menarik agar promosi lebih efektif.
        </p>
      </div>
    </template>
    <template #body>
      <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium mb-1"
              >Nama Banner</label
            >
            <input
              v-model="formData.name"
              type="text"
              id="name"
              class="form-input w-full disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
              placeholder="Contoh: August Special Deals"
              required
              :disabled="bannerStore.isFormLoading"
            />
          </div>
          <div>
            <label for="status" class="block text-sm font-medium mb-1"
              >Status Banner</label
            >
            <select
              v-model="formData.status"
              id="status"
              class="form-select w-full disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
              :disabled="bannerStore.isFormLoading"
            >
              <option :value="true">Aktif</option>
              <option :value="false">Tidak Aktif</option>
            </select>
          </div>
        </div>
        <div>
          <label for="description" class="block text-sm font-medium mb-1"
            >Deskripsi</label
          >
          <textarea
            v-model="formData.description"
            id="description"
            rows="4"
            class="form-textarea w-full disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            placeholder="Contoh: Bolu adalah produk kue..."
            required
            :disabled="bannerStore.isFormLoading"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Gambar</label>
          <label
            for="image-upload"
            class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700"
            :class="
              bannerStore.isFormLoading
                ? 'cursor-not-allowed bg-gray-100'
                : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
            "
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
                <span class="font-semibold">Klik untuk upload</span> atau seret
                gambar
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
              :disabled="bannerStore.isFormLoading"
            />
          </label>
          <div v-if="previewUrl" class="mt-2">
            <p class="text-sm font-medium mb-1">Preview:</p>
            <img
              :src="previewUrl"
              class="h-24 w-48 object-cover rounded shadow-sm border"
            />
          </div>
        </div>
      </form>
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
          :class="{ 'pointer-events-none': isButtonDisabled }"
        >
          {{
            bannerStore.isFormLoading
              ? "Menyimpan..."
              : isEditMode
              ? "Simpan Perubahan"
              : "Tambah"
          }}
        </button>
        <span
          v-if="isButtonDisabled && !bannerStore.isFormLoading"
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
import { useBannerStore } from "@/features/banner/presentation/stores/bannerStore";
import BaseModal from "@/components/modals/BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";

const bannerStore = useBannerStore();
const isEditMode = computed(() => !!bannerStore.selectedBanner);

const formData = ref({});
const selectedFile = ref(null);
const previewUrl = ref("");
const originalData = ref(null);

// PERBAIKAN: Pantau status buka/tutup modal, bukan data banner
watch(
  () => bannerStore.isFormModalOpen,
  (isOpen) => {
    // Jalankan logika HANYA saat modal dibuka
    if (isOpen) {
      const banner = bannerStore.selectedBanner;
      if (banner) {
        // Mode Edit: Isi form dengan data yang sudah di-fetch oleh store
        const dataToEdit = {
          name: banner.name,
          description: banner.description,
          status: banner.isActive,
        };
        formData.value = { ...dataToEdit };
        originalData.value = { ...dataToEdit };
        previewUrl.value = banner.photo;
      } else {
        // Mode Tambah: Reset form ke kondisi awal
        formData.value = { name: "", description: "", status: true };
        originalData.value = null;
        previewUrl.value = "";
      }
      selectedFile.value = null;
    }
  },
  // Tambahkan opsi ini agar watch berjalan saat komponen pertama kali dibuat
  { immediate: true }
);

const isButtonDisabled = computed(() => {
  if (bannerStore.isFormLoading) {
    return true;
  }
  if (isEditMode.value) {
    const hasDataChanged =
      JSON.stringify(formData.value) !== JSON.stringify(originalData.value);
    const hasNewFile = !!selectedFile.value;
    return !hasDataChanged && !hasNewFile;
  } else {
    return (
      !formData.value.name || !formData.value.description || !selectedFile.value
    );
  }
});

const tooltipMessage = computed(() => {
  if (isEditMode.value) {
    return "Lakukan perubahan terlebih dahulu.";
  } else {
    return "Silakan lengkapi nama, deskripsi, dan gambar.";
  }
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const handleSubmit = () => {
  if (isButtonDisabled.value) return;

  const data = new FormData();
  data.append("name", formData.value.name);
  data.append("description", formData.value.description);
  data.append("status", formData.value.status ? 1 : 0);
  if (selectedFile.value) {
    data.append("image", selectedFile.value);
  }

  bannerStore.submitBanner(data);
};

const closeFormModal = () => {
  bannerStore.isFormModalOpen = false;
};
</script>
