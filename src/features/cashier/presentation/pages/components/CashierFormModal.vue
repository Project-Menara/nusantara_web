<template>
  <BaseModal :isOpen="cashierStore.isFormModalOpen" @close="closeFormModal">
    <template #header>
      <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-gray-900 dark:text-white">{{ isEditMode ?
        'Edit Kasir' : 'Tambah Kasir' }}</DialogTitle>
    </template>
    <template #body>
      <div class="relative">
        <div v-if="isEditMode && cashierStore.isFormLoading"
          class="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-10 rounded-lg">
          <svg class="animate-spin h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>
        <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium mb-1">Nama Lengkap</label>
              <input v-model="formData.name" type="text" id="name" class="form-input w-full" required
                :disabled="cashierStore.isFormLoading" />
            </div>
            <div>
              <label for="username" class="block text-sm font-medium mb-1">Username</label>
              <input v-model="formData.username" type="text" id="username" class="form-input w-full" required
                :disabled="cashierStore.isFormLoading" />
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium mb-1">Email</label>
            <input v-model="formData.email" type="email" id="email"
              class="form-input w-full disabled:bg-gray-100 dark:disabled:bg-gray-700" required
              :disabled="cashierStore.isFormLoading || isEditMode" />
          </div>

          <div v-if="!isEditMode">
            <label for="password" class="block text-sm font-medium mb-1">Password</label>
            <div class="relative">
              <input v-model="formData.password" :type="isPasswordVisible ? 'text' : 'password'" id="password"
                class="form-input w-full pr-10" :required="!isEditMode" :disabled="cashierStore.isFormLoading" />
              <button type="button" @click="isPasswordVisible = !isPasswordVisible"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Toggle password visibility">
                <EyeSlashIcon v-if="isPasswordVisible" class="h-5 w-5" />
                <EyeIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Foto</label>
            <input @change="handleFileChange" type="file" class="form-input w-full" accept="image/png, image/jpeg"
              :disabled="cashierStore.isFormLoading" />
            <img v-if="previewUrl" :src="previewUrl" class="h-24 w-24 mt-2 object-cover rounded-full shadow-lg" />
          </div>
        </form>
      </div>
    </template>
    <template #footer>
      <button @click="closeFormModal" type="button"
        class="btn border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500">Batal</button>
      <div class="relative inline-block group">
        <button @click="handleSubmit" :disabled="isButtonDisabled"
          class="btn bg-violet-500 hover:bg-violet-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
          <span v-if="cashierStore.isFormLoading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Menyimpan...
          </span>
          <span v-else>{{ isEditMode ? 'Simpan Perubahan' : 'Tambah' }}</span>
        </button>

        <span v-if="isButtonDisabled && !cashierStore.isFormLoading"
          class="absolute bottom-full right-0 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-700 text-white text-xs rounded-md shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 z-50 text-center">
          {{ tooltipMessage }}
        </span>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useCashierStore } from "../../stores/useCashierStore";
import BaseModal from "@/components/modals/BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/20/solid";

const cashierStore = useCashierStore();
const isEditMode = computed(() => !!cashierStore.selectedCashier?.id);
const formData = ref({});
const previewUrl = ref("");
const selectedFile = ref(null);
const originalData = ref(null);
const isPasswordVisible = ref(false);

const resetForm = () => {
  formData.value = { name: "", username: "", email: "", password: "" };
  previewUrl.value = "";
  selectedFile.value = null;
  originalData.value = null;
  isPasswordVisible.value = false;
};

watch(() => cashierStore.selectedCashier, (newCashier) => {
  if (newCashier) {
    const dataToEdit = {
      name: newCashier.name,
      username: newCashier.username,
      email: newCashier.email,
    };

    // PERBAIKAN: Tetap set formData dengan email, tapi tidak dengan password
    formData.value = { ...dataToEdit, password: "" };

    // PERBAIKAN: Simpan data asli *tanpa* email untuk perbandingan
    originalData.value = {
      name: newCashier.name,
      username: newCashier.username
    };

    previewUrl.value = newCashier.photo;
    selectedFile.value = null;
    isPasswordVisible.value = false;
  }
});

watch(() => cashierStore.isFormModalOpen, (isOpen) => {
  if (isOpen && !cashierStore.selectedCashier) resetForm();
});

const isButtonDisabled = computed(() => {
  if (cashierStore.isFormLoading) return true;

  if (isEditMode.value) {
    // PERBAIKAN: Logika perbandingan diubah
    // Bandingkan hanya data yang bisa diedit (nama, username)
    const hasDataChanged = formData.value.name !== originalData.value.name ||
      formData.value.username !== originalData.value.username;

    // Tombol dinonaktifkan jika TIDAK ada data berubah DAN TIDAK ada file baru
    return !hasDataChanged && !selectedFile.value;
  }

  // PERBAIKAN: Logika create (password & file wajib)
  return !formData.value.name || !formData.value.username || !formData.value.email || !formData.value.password || !selectedFile.value;
});

// PERBAIKAN: Tambahkan computed property untuk pesan tooltip
const tooltipMessage = computed(() => {
  if (cashierStore.isFormLoading) return "Sedang memproses...";

  if (isEditMode.value) {
    return "Lakukan perubahan pada Nama, Username, atau Foto untuk menyimpan.";
  } else {
    if (!formData.value.name) return "Nama wajib diisi.";
    if (!formData.value.username) return "Username wajib diisi.";
    if (!formData.value.email) return "Email wajib diisi.";
    if (!formData.value.password) return "Password wajib diisi.";
    if (!selectedFile.value) return "Foto wajib diunggah.";
    return "Lengkapi semua data.";
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

  // PERBAIKAN: Logika pengiriman data disederhanakan
  data.append('name', formData.value.name);
  data.append('username', formData.value.username);

  if (!isEditMode.value) {
    // Mode Create: Kirim email, password, dan status
    data.append('email', formData.value.email);
    data.append('password', formData.value.password);
    data.append("status", 1); // Status default 1 (Aktif) saat create
  }

  // Kirim gambar hanya jika ada file baru yang dipilih
  if (selectedFile.value) {
    data.append("image", selectedFile.value);
  }

  cashierStore.submitCashier(data);
};

const closeFormModal = () => { cashierStore.isFormModalOpen = false; };
</script>