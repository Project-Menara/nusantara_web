// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "@/router/index";
import { useAuthStore } from "./features/auth/presentation/stores/authStore";
import "./css/style.css";

// Buat fungsi async untuk memulai aplikasi
async function startApp() {
  const app = createApp(App);

  // 1. Pasang Pinia
  app.use(createPinia());

  // 2. Panggil action inisialisasi SEBELUM memasang router
  const authStore = useAuthStore();
  await authStore.initializeAuth();

  // 3. Pasang Router setelah state auth pulih
  app.use(router);

  // 4. Mount aplikasi
  app.mount("#app");
}

// Jalankan fungsi untuk memulai aplikasi
startApp();
