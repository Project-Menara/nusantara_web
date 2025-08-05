<template>
  <main
    class="min-h-screen bg-gradient-to-br from-violet-400 via-violet-500 to-violet-600 flex items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute top-0 left-0 w-full h-full"
        style="
          background-image: radial-gradient(
              circle at 25% 25%,
              white 2px,
              transparent 2px
            ),
            radial-gradient(circle at 75% 75%, white 2px, transparent 2px);
          background-size: 50px 50px;
        "
      ></div>
    </div>

    <!-- Floating Elements -->
    <div
      class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"
    ></div>
    <div
      class="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"
    ></div>
    <div
      class="absolute top-1/2 left-5 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse delay-500"
    ></div>

    <!-- Login Card -->
    <div
      class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-auto transform transition-all duration-500 hover:shadow-3xl animate-fadeInUp relative z-10"
    >
      <!-- Logo Section -->
      <div class="text-center mb-6 sm:mb-8 animate-fadeInDown">
        <img
          class="mx-auto h-12 w-auto"
          src="/images/logo.png"
          alt="Logo Aplikasi"
        />
      </div>

      <!-- Title Section -->
      <div class="text-center mb-6 sm:mb-8 animate-fadeInDown delay-100">
        <h1
          class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent mb-2 tracking-tight"
        >
          Login Admin
        </h1>
        <p class="text-gray-600 text-sm sm:text-base leading-relaxed">
          Masukkan kredensial untuk mengakses dashboard 
        </p>
      </div>

      <!-- Form Section -->
      <form
        @submit.prevent="handleLogin"
        class="space-y-5 sm:space-y-6 animate-fadeInUp delay-200"
      >
        <!-- Email Field -->
        <div class="relative group">
          <label
            class="block text-gray-700 text-sm font-semibold mb-2 transition-colors group-focus-within:text-violet-600"
          >
            <svg
              class="inline w-4 h-4 mr-2 text-violet-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
            Alamat Email
          </label>
          <input
            id="email-address"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="w-full px-4 py-3 sm:py-4 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all duration-300 transform focus:scale-[1.02] hover:bg-gray-100 text-sm sm:text-base"
            placeholder="admin@menara.com"
          />
          <div
            class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-violet-400 to-violet-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"
          ></div>
        </div>

        <!-- Password Field -->
        <div class="relative group">
          <label
            class="block text-gray-700 text-sm font-semibold mb-2 transition-colors group-focus-within:text-violet-600"
          >
            <svg
              class="inline w-4 h-4 mr-2 text-violet-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Kata Sandi
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="w-full px-4 py-3 sm:py-4 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all duration-300 transform focus:scale-[1.02] hover:bg-gray-100 pr-12 text-sm sm:text-base"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              v-show="password.length > 0"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-violet-600 transition-all duration-200 p-1 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <EyeIcon v-if="!showPassword" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5" />
            </button>
          </div>
          <div
            class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-violet-400 to-violet-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"
          ></div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="auth.isLoading"
          class="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 text-sm sm:text-base relative overflow-hidden group"
        >
          <!-- Button Ripple Effect -->
          <span
            class="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150 rounded-xl"
          ></span>

          <!-- Loading Spinner -->
          <div v-if="auth.isLoading" class="flex items-center justify-center">
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
            Memproses...
          </div>
          <span v-else class="flex items-center justify-center">
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Masuk
          </span>
        </button>

        <!-- Error Message -->
        <div v-if="auth.error" class="animate-shake">
          <div
            class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center"
          >
            <svg
              class="w-5 h-5 text-red-500 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-sm text-red-700 font-medium">{{ auth.error }}</p>
          </div>
        </div>

        <!-- Forgot Password Link -->
        <div class="text-center mt-6">
          <a
            href="#"
            class="text-violet-600 text-sm font-medium hover:text-violet-700 transition-colors duration-200 inline-flex items-center group"
          >
            <svg
              class="w-4 h-4 mr-1 group-hover:rotate-12 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Lupa Kata Sandi?
          </a>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "../stores/authStore"; // Pastikan path ini benar
import { useRouter } from "vue-router";

// Menginisialisasi variabel dengan string kosong
const email = ref("");
const password = ref("");
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
