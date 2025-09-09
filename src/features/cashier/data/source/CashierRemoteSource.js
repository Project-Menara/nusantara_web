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
    formData.append('_method', 'PUT');
    const response = await apiClient.put(`/cashier/${id}/edit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
  
  async updateCashierStatus(id, status) {
    // Untuk update status, kita kirim JSON biasa
    const response = await apiClient.put(`/cashier/${id}/edit`, { status });
    return response.data;
  }

  async deleteCashier(id) {
    const response = await apiClient.delete(`/cashier/${id}/delete`);
    return response.data;
  }
}
