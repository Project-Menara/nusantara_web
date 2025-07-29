import apiClient from "@/lib/apiClient.js";

export class BannerRemoteSource {
  async getBanners(page = 1) {
    try {
      const response = await apiClient.get(`/banner?page=${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async createBanner(formData) {
    try {
      // API yang menerima file harus menggunakan FormData
      const response = await apiClient.post("/banner/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getBannerById(id) {
    try {
      const response = await apiClient.get(`/banner/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateBanner(id, formData) {
    try {
      // Endpoint PUT untuk file seringkali menggunakan POST dengan method spoofing
      // atau API modern bisa handle PUT dengan multipart/form-data.
      // Kita asumsikan API bisa handle PUT.
      const response = await apiClient.put(`/banner/${id}/edit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateBannerStatus(id, status) {
    try {
      const response = await apiClient.put(`/banner/${id}/edit-status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteBanner(id) {
    try {
      const response = await apiClient.delete(`/banner/${id}/delete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
