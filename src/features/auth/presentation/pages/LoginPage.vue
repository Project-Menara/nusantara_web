<template>
  <main class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col md:flex-row items-center justify-center min-h-screen"
    >
      <div
        class="hidden md:flex md:w-1/2 h-screen bg-violet-600 items-center justify-center p-12"
      >
        <div class="text-white text-center">
          <h1 class="text-4xl font-bold mb-4">Kelola Bisnis Anda</h1>
          <p class="text-lg text-violet-200">
            Semua yang Anda butuhkan dalam satu dasbor yang intuitif dan kuat.
          </p>
        </div>
      </div>

      <div class="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div class="w-full max-w-md space-y-8">
          <div>
            <img
              class="mx-auto h-12 w-auto"
              src="/images/logo.png"
              alt="Logo Aplikasi"
            />
            <h2
              class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              Selamat Datang Kembali
            </h2>
            <p
              class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400"
            >
              Silakan masuk untuk melanjutkan
            </p>
          </div>

          <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
            <div class="rounded-md shadow-sm">
              <div>
                <label for="email-address" class="sr-only">Alamat Email</label>
                <input
                  id="email-address"
                  v-model="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Alamat Email"
                />
              </div>
              <div class="-mt-px">
                <label for="password" class="sr-only">Password</label>
                <input
                  id="password"
                  v-model="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="relative block w-full appearance-none rounded-b-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Password"
                />
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm">
                <a
                  href="#"
                  class="font-medium text-violet-600 hover:text-violet-500"
                >
                  Lupa password?
                </a>
                Halaman 2 dari 2
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="auth.isLoading"
                class="group relative flex w-full justify-center rounded-md border border-transparent bg-violet-600 py-3 px-4 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:bg-violet-400"
              >
                {{ auth.isLoading ? "Memproses..." : "Masuk" }}
              </button>
            </div>

            <p v-if="auth.error" class="text-center text-sm text-red-600">
              {{ auth.error }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore"; // Pastikan path ini benar
import { useRouter } from "vue-router";

// Menginisialisasi variabel dengan string kosong
const email = ref("");
const password = ref("");

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    await auth.login({
      email: email.value,
      password: password.value,
    });
    router.push("/dashboard");
  } catch (error) {
    console.error("Gagal login dari komponen:", error.message);
  }
};
</script>
