<template>
  <BaseModal :isOpen="cashierStore.isFormModalOpen" @close="closeFormModal">
    <template #header>
      <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-gray-900 dark:text-white">{{ isEditMode ? 'Edit Kasir' : 'Tambah Kasir' }}</DialogTitle>
    </template>
    <template #body>
      <div class="relative">
        <!-- Loading Spinner for Edit Mode -->
        <div v-if="isEditMode && cashierStore.isFormLoading" class="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-10 rounded-lg">
            <svg class="animate-spin h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
        <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium mb-1">Nama Lengkap</label>
              <input v-model="formData.name" type="text" id="name" class="form-input w-full" required :disabled="cashierStore.isFormLoading" />
            </div>
            <div>
              <label for="username" class="block text-sm font-medium mb-1">Username</label>
              <input v-model="formData.username" type="text" id="username" class="form-input w-full" required :disabled="cashierStore.isFormLoading" />
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium mb-1">Email</label>
            <input v-model="formData.email" type="email" id="email" class="form-input w-full" required :disabled="cashierStore.isFormLoading" />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium mb-1">Password</label>
            <input v-model="formData.password" type="password" id="password" class="form-input w-full" :placeholder="isEditMode ? 'Kosongkan jika tidak ingin ganti' : ''" :required="!isEditMode" :disabled="cashierStore.isFormLoading" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Foto</label>
            <input @change="handleFileChange" type="file" class="form-input w-full" accept="image/png, image/jpeg" :disabled="cashierStore.isFormLoading" />
            <img v-if="previewUrl" :src="previewUrl" class="h-24 w-24 mt-2 object-cover rounded-full shadow-lg" />
          </div>
        </form>
      </div>
    </template>
    <template #footer>
        <button @click="closeFormModal" type="button" class="btn border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500">Batal</button>
        <div class="relative inline-block group">
            <button @click="handleSubmit" :disabled="isButtonDisabled" class="btn bg-violet-500 hover:bg-violet-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
                <span v-if="cashierStore.isFormLoading" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Menyimpan...
                </span>
                <span v-else>{{ isEditMode ? 'Simpan Perubahan' : 'Tambah' }}</span>
            </button>
        </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useCashierStore } from "../../stores/useCashierStore";
import BaseModal from "@/components/modals/BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";

const cashierStore = useCashierStore();
const isEditMode = computed(() => !!cashierStore.selectedCashier?.id);
const formData = ref({});
const previewUrl = ref("");
const selectedFile = ref(null);
const originalData = ref(null);

const resetForm = () => {
  formData.value = { name: "", username: "", email: "", password: "" };
  previewUrl.value = "";
  selectedFile.value = null;
  originalData.value = null;
};

watch(() => cashierStore.selectedCashier, (newCashier) => {
  if (newCashier) {
    const dataToEdit = {
      name: newCashier.name,
      username: newCashier.username,
      email: newCashier.email,
    };
    formData.value = { ...dataToEdit, password: "" };
    originalData.value = { ...dataToEdit };
    previewUrl.value = newCashier.photo;
    selectedFile.value = null;
  }
});

watch(() => cashierStore.isFormModalOpen, (isOpen) => {
  if (isOpen && !cashierStore.selectedCashier) resetForm();
});

const isButtonDisabled = computed(() => {
    if (cashierStore.isFormLoading) return true;
    if(isEditMode.value) {
        const hasDataChanged = JSON.stringify({ name: formData.value.name, username: formData.value.username, email: formData.value.email }) !== JSON.stringify(originalData.value);
        return !hasDataChanged && !selectedFile.value && !formData.value.password;
    }
    return !formData.value.name || !formData.value.email || !formData.value.password || !selectedFile.value;
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

  Object.keys(formData.value).forEach((key) => {
    if (key === 'password' && isEditMode.value && !formData.value.password) return; // Jangan kirim password kosong di mode edit
    if (formData.value[key] !== null) {
      data.append(key, formData.value[key]);
    }
  });

  if (selectedFile.value) {
    data.append("image", selectedFile.value);
  }
  
  if (!isEditMode.value) {
    data.append("status", 1); // Status default 1 (Aktif) saat create
  }

  cashierStore.submitCashier(data);
};

const closeFormModal = () => { cashierStore.isFormModalOpen = false; };
</script>

