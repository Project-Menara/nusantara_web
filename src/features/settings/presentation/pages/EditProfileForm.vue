<template>
  <div>
    <h2 class="text-xl text-gray-800 dark:text-gray-100 font-bold mb-6">Edit Profil</h2>
    <div v-if="!user" class="text-center">Memuat data profil...</div>
    <form v-else @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium mb-1" for="name">Nama</label>
          <input id="name" class="form-input w-full" type="text" v-model="formData.name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="username">User Name</label>
          <input id="username" class="form-input w-full" type="text" v-model="formData.username" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="email">Email</label>
          <input id="email" class="form-input w-full" type="email" v-model="formData.email" disabled />
        </div>
         </div>
      <div class="flex justify-end mt-6">
        <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] rounded-md">
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useModalStore } from '@/stores/modalStore';

const props = defineProps({
  user: Object,
});

const formData = ref({});
const modalStore = useModalStore();

// Salin data dari props ke state lokal saat props tersedia
watch(() => props.user, (newUser) => {
  if (newUser) {
    formData.value = { ...newUser };
  }
}, { immediate: true });

const handleSubmit = () => {
  // TODO: Implementasi logika update profil di sini
  console.log("Data to update:", formData.value);
  modalStore.openModal({
    newTitle: 'Info',
    newMessage: 'Fitur update profil belum diimplementasikan.',
    newStatus: 'info',
  });
};
</script>