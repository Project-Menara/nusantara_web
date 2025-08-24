import apiClient from "@/lib/apiClient.js";

export class ProductRemoteSource {
  async getProducts(page = 1, search = "") {
    const params = new URLSearchParams({ page });
    if (search) params.append("search", search);
    const response = await apiClient.get(`/product?${params.toString()}`);
    return response.data;
  }
  /**
   * Membuat produk baru menggunakan FormData (untuk upload file).
   */
  async createProduct(formData) {
    try {
      const response = await apiClient.post("/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil detail satu produk berdasarkan ID.
   */
  async getProductById(id) {
    try {
      const response = await apiClient.get(`/product/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Memperbarui produk yang ada menggunakan FormData.
   * Menggunakan POST dengan method spoofing (_method: 'PUT') adalah praktik umum
   * jika backend Anda tidak secara native mendukung PUT dengan multipart/form-data.
   */
  async updateProduct(id, formData) {
    try {
      // Axios secara teknis bisa mengirim PUT dengan FormData, tetapi POST lebih umum.
      // Kita tetap gunakan POST dan biarkan _method: 'PUT' di handle backend.
      const response = await apiClient.put(`/product/${id}/edit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus produk berdasarkan ID.
   */
  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`/product/${id}/delete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProductStatus(id, status) {
    try {
      // Body-nya adalah JSON, bukan FormData
      const response = await apiClient.put(`/product/${id}/edit-status`, {
        status: status ? 1 : 0, // Kirim 1 untuk true, 0 untuk false
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
