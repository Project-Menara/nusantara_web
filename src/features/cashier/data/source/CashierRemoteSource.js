import apiClient from "@/lib/apiClient.js";

// Kelas yang bertanggung jawab penuh untuk berinteraksi dengan endpoint API kasir.
export class CashierRemoteSource {
  async getCashiers(page = 1, search = "") {
    const params = new URLSearchParams({ page });
    if (search) params.append("search", search);
    const response = await apiClient.get(`/cashier?${params.toString()}`);
    return response.data;
  }

  async createCashier(formData) {
    const response = await apiClient.post("/cashier/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async getCashierById(id) {
    const response = await apiClient.get(`/cashier/${id}`);
    return response.data;
  }

  async updateCashier(id, formData) {
    // Gunakan POST dengan _method: 'PUT' untuk mengakomodasi file upload
    formData.append("_method", "PUT");
    const response = await apiClient.put(`/cashier/${id}/edit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async updateCashierStatus(id, status) {
    // Buat objek FormData baru
    const formData = new FormData();

    // Tambahkan status ke dalamnya
    formData.append("status", status ? 1 : 0);

    // Tambahkan _method spoofing karena endpoint ini sama dengan edit utama
    formData.append("_method", "PUT");

    // Kirim sebagai multipart/form-data menggunakan POST ke endpoint edit
    const response = await apiClient.put(`/cashier/${id}/edit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  }

  async deleteCashier(id) {
    const response = await apiClient.delete(`/cashier/${id}/delete`);
    return response.data;
  }
}
