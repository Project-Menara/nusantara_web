// src/lib/apiClient.js
import axios from "axios";
import { useAuthStore } from "@/features/auth/presentation/stores/authStore";

// Ambil baseURL dari environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error(
    "VITE_API_BASE_URL is not defined. Please check your .env file."
  );
}

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

//💡 BONUS: Di sini Anda juga bisa menambahkan interceptor
// untuk otomatis menambahkan token ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// PERBAIKAN: Interceptor untuk MENANGANI error dari setiap respons
apiClient.interceptors.response.use(
  // Jika respons SUKSES, teruskan saja
  (response) => response,
  // Jika respons GAGAL, cek errornya
  (error) => {
    // Cek jika error adalah 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();

      // Panggil fungsi logout untuk membersihkan token dan redirect
      authStore.logout();

      // Anda juga bisa menampilkan modal dari sini jika mau
      // const modalStore = useModalStore();
      // modalStore.openModal({ newTitle: 'Sesi Habis', newMessage: 'Sesi Anda telah berakhir, silakan login kembali.', newStatus: 'error' });
    }

    // Teruskan error agar bisa ditangani lebih lanjut jika perlu
    return Promise.reject(error);
  }
);

export default apiClient;
