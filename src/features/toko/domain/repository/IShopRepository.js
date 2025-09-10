export class IShopRepository {
  async getShops(page = 1, search = "") {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async createShop(formData) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async getShopById(id) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async updateShop(id, formData) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async deleteShop(id) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async updateShopStatus(id, status) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
}
