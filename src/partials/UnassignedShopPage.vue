<template>
  <div class="flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
    <div class="text-center p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-md w-full">
      <svg class="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Akses Toko Belum Ditugaskan</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Akun Anda belum ditugaskan ke toko mana pun. Harap hubungi Super Admin untuk mendapatkan akses dan mengelola toko.
      </p>
      <button @click="logout" class="mt-6 btn bg-violet-500 hover:bg-violet-600 text-white">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
const authStore = useAuthStore();
const logout = () => {
  authStore.logout();
};
</script>