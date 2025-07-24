// features/auth/data/source/AuthRemoteSource.js
import apiClient from "../../../../lib/apiClient";

export class AuthRemoteSource {
  async login(email, password) {
    try {
      const response = await apiClient.post("/user/admin/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login gagawl");
    }
  }

  async getProfile() {
    try {
      // Panggil endpoint. Token akan ditambahkan otomatis oleh interceptor di apiClient.
      const response = await apiClient.get("/user/admin/me");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Gagal mengambil profil"
      );
    }
  }

  async logout() {
    try {
      await apiClient.post("/user/admin/logout");
    } catch (error) {
      // Kita bisa abaikan error di sini, karena logout di client harus tetap berjalan
      console.error(
        "Server logout failed, proceeding with client-side logout.",
        error
      );
    }
  }
}
