<!-- bannerFormModal -->
<template>
  <BaseModal :isOpen="bannerStore.isFormModalOpen" @close="closeFormModal">
    <template #header>
      <div class="text-center">
        <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
          {{ isEditMode ? 'Edit Banner' : 'Tambah Banner' }}
        </DialogTitle>
        <p class="mt-2 text-sm text-gray-500">
          Lengkapi data banner berikut untuk ditampilkan di aplikasi. Gunakan gambar yang menarik agar promosi lebih efektif.
        </p>
      </div>
    </template>
    <template #body>
      <div v-if="bannerStore.isFormLoading" class="text-center p-8">Memuat data...</div>
      <form v-else @submit.prevent="handleSubmit" class="mt-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium mb-1">Nama Banner</label>
            <input v-model="formData.name" type="text" id="name" class="form-input w-full" placeholder="Contoh: August Special Deals" required />
          </div>
          <div>
            <label for="status" class="block text-sm font-medium mb-1">Status Banner</label>
            <select v-model="formData.status" id="status" class="form-select w-full">
              <option :value="true">Aktif</option>
              <option :value="false">Tidak Aktif</option>
            </select>
          </div>
        </div>
        <div>
          <label for="description" class="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea v-model="formData.description" id="description" rows="4" class="form-textarea w-full" placeholder="Contoh: Bolu adalah produk kue..." required></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Gambar</label>
          <label for="image-upload" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Klik untuk upload</span> atau seret gambar</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 2MB)</p>
            </div>
            <input @change="handleFileChange" id="image-upload" type="file" class="hidden" accept="image/png, image/jpeg"/>
          </label>
          <div v-if="previewUrl" class="mt-2">
            <p class="text-sm font-medium mb-1">Preview:</p>
            <img :src="previewUrl" class="h-24 w-48 object-cover rounded shadow-sm border"/>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button @click="closeFormModal" type="button" class="btn border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500">Batal</button>
      <button @click="handleSubmit" :disabled="bannerStore.isFormLoading" class="btn bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] text-white disabled:opacity-50">
        {{ bannerStore.isFormLoading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Tambah') }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useBannerStore } from '@/features/banner/presentation/stores/bannerStore';
import BaseModal from '@/components/modals/BaseModal.vue';
import { DialogTitle } from '@headlessui/vue';

const bannerStore = useBannerStore();
const isEditMode = computed(() => !!bannerStore.selectedBanner);

const formData = ref({});
const selectedFile = ref(null);
const previewUrl = ref('');

watch(() => bannerStore.isFormModalOpen, (isOpen) => {
  if (isOpen) {
    const banner = bannerStore.selectedBanner;
    if (banner) {
      // Mode Edit: Isi form dengan data yang ada
      formData.value = { name: banner.name, description: banner.description, status: banner.isActive };
      previewUrl.value = banner.photo;
    } else {
      // Mode Tambah: Reset form
      formData.value = { name: '', description: '', status: true };
      previewUrl.value = '';
    }
    selectedFile.value = null;
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
  const data = new FormData();
  data.append('name', formData.value.name);
  data.append('description', formData.value.description);
  data.append('status', formData.value.status ? 1 : 0);
  if (selectedFile.value) {
    data.append('image', selectedFile.value);
  }
  
  bannerStore.submitBanner(data);
};

const closeFormModal = () => {
  bannerStore.isFormModalOpen = false;
};
</script>