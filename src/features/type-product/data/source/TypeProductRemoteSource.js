// Path: src/features/type-product/data/source/TypeProductRemoteSource.js
import apiClient from "@/lib/apiClient.js";

export class TypeProductRemoteSource {
  async getTypeProducts(page = 1, search = "") {
    try {
      // ✅ Membangun parameter URL
      const params = new URLSearchParams({
        page: page,
      });

      // ✅ Menambahkan parameter search hanya jika ada isinya
      if (search) {
        params.append("search", search);
      }

      const response = await apiClient.get(`/type-product?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createTypeProduct(formData) {
    try {
      const response = await apiClient.post("/type-product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getTypeProductById(id) {
    try {
      const response = await apiClient.get(`/type-product/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateTypeProduct(id, formData) {
    try {
      const response = await apiClient.put(
        `/type-product/${id}/edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateTypeProductStatus(id, status) {
    try {
      const response = await apiClient.put(`/type-product/${id}/edit-status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteTypeProduct(id) {
    try {
      const response = await apiClient.delete(`/type-product/${id}/delete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
