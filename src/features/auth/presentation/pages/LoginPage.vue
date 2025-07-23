<template>
  <main class="min-h-screen bg-orange-400 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
      <!-- Logo Section -->
      <div class="text-center mb-8">
        <img
          class="mx-auto h-12 w-auto"
          src="/images/logo.png"
          alt="Logo Aplikasi"
        />
      </div>

      <!-- Title Section -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Login Akun</h1>
        <p class="text-gray-600 text-sm">
          Masukkan email dan sandi untuk melanjutkan
        </p>
      </div>

      <!-- Form Section -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email Field -->
        <div>
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Alamat Email:
          </label>
          <input
            id="email-address"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all"
            placeholder="esteban_schiller@gmail.com"
          />
        </div>

        <!-- Password Field -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-gray-700 text-sm font-medium">
              Sandi:
            </label>
            <a
              href="#"
              class="text-gray-500 text-sm hover:text-orange-500 transition-colors"
            >
              Lupa Password
            </a>
          </div>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all pr-12"
              placeholder="••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                v-if="!showPassword"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-.786-2.12m4.242 4.242l2.12.786m-2.12-.786l2.12-2.12m0 0L17.5 4.5M2.5 2.5l15 15"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Remember Password Checkbox -->
        <div class="flex items-center">
          <input
            id="remember-password"
            v-model="rememberPassword"
            type="checkbox"
            class="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
          />
          <label for="remember-password" class="ml-2 text-sm text-gray-600">
            Ingat Password
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="auth.isLoading"
          class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          {{ auth.isLoading ? "Memproses..." : "Login" }}
        </button>

        <!-- Error Message -->
        <p v-if="auth.error" class="text-center text-sm text-red-600">
          {{ auth.error }}
        </p>

        <!-- Forgot Password Link -->
        <div class="text-center mt-6">
          <a
            href="#"
            class="text-red-500 text-sm hover:text-red-600 transition-colors"
          >
            Lupa Password?
          </a>
        </div>
      </form>
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
const rememberPassword = ref(false);
const showPassword = ref(false);

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

<style scoped>
/* Additional custom styles if needed */
.transition-all {
  transition: all 0.3s ease;
}
</style>
