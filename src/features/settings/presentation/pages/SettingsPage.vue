<template>
  <main class="bg-white dark:bg-gray-900 h-full">
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">Pengaturan Akun</h1>

      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul class="flex flex-wrap -mb-px">
            <li class="mr-2">
              <a href="#" @click.prevent="activeTab = 'profile'" class="inline-block p-4 border-b-2 rounded-t-lg" :class="activeTab === 'profile' ? 'border-violet-500 text-violet-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'">Edit Profil</a>
            </li>
            <li class="mr-2">
              <a href="#" @click.prevent="activeTab = 'security'" class="inline-block p-4 border-b-2 rounded-t-lg" :class="activeTab === 'security' ? 'border-violet-500 text-violet-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300'">Keamanan</a>
            </li>
          </ul>
        </div>
        
        <div>
          <div v-if="activeTab === 'profile'">
            <EditProfileForm :user="authStore.user" />
          </div>
          <div v-if="activeTab === 'security'">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
import EditProfileForm from '@/components/settings/EditProfileForm.vue';
import ChangePasswordForm from '@/components/settings/ChangePasswordForm.vue';

const authStore = useAuthStore();
const activeTab = ref('profile');

// Pastikan data profil sudah dimuat saat komponen ini muncul
onMounted(() => {
  if (!authStore.user) {
    authStore.initializeAuth();
  }
});
</script>