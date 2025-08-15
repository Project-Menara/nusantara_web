import apiClient from "@/lib/apiClient.js";

export class ProductRemoteSource {
  async getProducts(page = 1, search = "") {
    const params = new URLSearchParams({ page });
    if (search) params.append("search", search);
    const response = await apiClient.get(`/product?${params.toString()}`);
    return response.data;
  }
  // ... Tambahkan fungsi lain (create, getById, update) nanti ...
}
