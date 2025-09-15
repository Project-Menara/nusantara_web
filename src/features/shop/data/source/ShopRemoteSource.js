import apiClient from "@/lib/apiClient.js";

export class ShopRemoteSource {
  async getShops(page = 1, search = "") {
    const params = new URLSearchParams({ page });
    if (search) params.append("search", search);
    const response = await apiClient.get(`/shop?${params.toString()}`);
    return response.data;
  }

  async createShop(formData) {
    const response = await apiClient.post("/shop/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async getShopById(id) {
    const response = await apiClient.get(`/shop/${id}`);
    return response.data;
  }
  
  async updateShop(id, formData) {
    formData.append('_method', 'PUT');
    const response = await apiClient.put(`/shop/${id}/edit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async deleteShop(id) {
    const response = await apiClient.delete(`/shop/${id}/delete`);
    return response.data;
  }
  
  async updateShopStatus(id, status) {
    const response = await apiClient.put(`/shop/${id}/edit-status`, { 
      status: status ? 1 : 0 
    });
    return response.data;
  }
}
