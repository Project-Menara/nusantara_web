// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "@/router/index";
import { useAuthStore } from "./features/auth/presentation/stores/authStore";
import "./css/style.css";
import { loadGoogleMaps } from "./lib/googleMapsLoader";

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
// startApp();
// Jalankan pemuat Google Maps terlebih dahulu
loadGoogleMaps()
  .then(() => {
    // Jika berhasil, baru jalankan fungsi untuk memulai aplikasi Vue
    console.log("Google Maps script loaded successfully.");
    startApp();
  })
  .catch((error) => {
    // Jika gagal, tampilkan error di console
    console.error("Failed to load Google Maps script:", error);
    // Anda tetap bisa memilih untuk menjalankan aplikasi tanpa peta
    // dengan memanggil startApp() di sini jika diperlukan,
    // atau menampilkan pesan error kepada pengguna.
    alert("Gagal memuat peta. Beberapa fitur mungkin tidak berfungsi.");
  });
