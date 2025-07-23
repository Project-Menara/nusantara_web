// 📦features/auth/presentation/stores/authStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthRepository } from "../../data/repository/AuthRepository";
import { LoginUserUseCase } from "../../domain/use-cases/LoginUserUseCase";
// Impor use case baru
import { GetProfileUseCase } from "../../domain/use-cases/GetProfileUseCase";
import { LogoutUserUseCase } from "../../domain/use-cases/LogoutUserUseCase";

export const useAuthStore = defineStore("auth", () => {
  // State (tidak ada perubahan)
  const user = ref(null);
  const token = ref(localStorage.getItem("auth_token") || null);
  const isAuthenticated = ref(false); // Default ke false
  const error = ref(null);
  const isLoading = ref(false);

  // Inisialisasi dependensi
  const repository = new AuthRepository();
  const loginUseCase = new LoginUserUseCase(repository);
  const getProfileUseCase = new GetProfileUseCase(repository); 
  const logoutUseCase = new LogoutUserUseCase(repository);

  // Action login (tidak ada perubahan)
  async function login(credentials) {
    isLoading.value = true;
    error.value = null;
    try {
      // Jalankan use case untuk login
      const result = await loginUseCase.execute(
        credentials.email,
        credentials.password
      );

      // Update state jika berhasil
      user.value = result.user;
      token.value = result.token;
      isAuthenticated.value = true;
    } catch (e) {
      // Tangkap error dan simpan pesannya
      error.value = e.message;
      isAuthenticated.value = false;
      throw e; // Lemparkan lagi error agar bisa ditangkap di komponen
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      // Jalankan use case logout
      await logoutUseCase.execute();
    } catch (e) {
      console.error("An error occurred during server logout:", e);
    } finally {
      // Selalu pastikan state di client bersih setelah logout
      user.value = null;
      token.value = null;
      isAuthenticated.value = false;
      isLoading.value = false;
      // Paksa refresh dan arahkan ke halaman login untuk sesi yang bersih
      window.location.href = "/login";
    }
  }

  // ACTION BARU: Untuk inisialisasi sesi
  async function initializeAuth() {
    const existingToken = localStorage.getItem("auth_token");
    if (existingToken) {
      isLoading.value = true;
      try {
        // Gunakan token yang ada untuk mengambil profil
        const userProfile = await getProfileUseCase.execute(existingToken);

        // Jika berhasil, set state
        user.value = userProfile;
        token.value = existingToken;
        isAuthenticated.value = true;
      } catch (e) {
        // Jika token tidak valid (error dari API), logout
        console.error("Session restore failed:", e.message);
        logout();
      } finally {
        isLoading.value = false;
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    initializeAuth,
    logout
  };
});
