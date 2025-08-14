// File: src/features/voucher/data/source/VoucherRemoteSource.js
import apiClient from "@/lib/apiClient.js";

export class VoucherRemoteSource {
  async getVouchers(page = 1, search = "") {
    const params = new URLSearchParams({ page });
    if (search) params.append("search", search);
    const response = await apiClient.get(`/voucher?${params.toString()}`);
    // console.log(response.data);s
    return response.data;
  }
  async createVoucher(data) {
    const response = await apiClient.post("/voucher/create", data);
    return response.data;
  }

  async getVoucherById(id) {
    const response = await apiClient.get(`/voucher/${id}`);
    return response.data;
  }

  async updateVoucher(id, data) {
    const response = await apiClient.put(`/voucher/${id}/edit`, data);
    return response.data;
  }

  async deleteVoucher(id) {
    const response = await apiClient.delete(`/voucher/${id}/delete`);
    return response.data;
  }

  async updateVoucherStatus(id, status) {
    const response = await apiClient.put(`/voucher/${id}/edit-status`, {
      status,
    });
    return response.data;
  }
  // ... Tambahkan fungsi lain (create, getById, update) sesuai kebutuhan ...
}
