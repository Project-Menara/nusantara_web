import apiClient from "@/lib/apiClient.js";

export class ShopContextRemoteSource {
  async getAvailableShops() {
    // Endpoint: {{BASE_URL}}/cashier/shop-names
    const response = await apiClient.get('/cashier/shop-names');
    return response.data;
  }

  async getShopDetails(shopId) {
    // Endpoint: {{BASE_URL}}/cashier/shop-cashier/:shop_id
    const response = await apiClient.get(`/cashier/shop-cashier/${shopId}`);
    return response.data;
  }

  async getShopProducts(shopId) {
    // Endpoint: {{BASE_URL}}/cashier/cashier-shop-product/:shop_id
    const response = await apiClient.get(`/cashier/cashier-shop-product/${shopId}`);
    return response.data;
  }
}