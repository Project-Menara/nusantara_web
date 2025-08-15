export class IProductRepository {
  async getProducts(page = 1, search = "") {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async createProduct(data) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async getProductById(id) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async updateProduct(id, data) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async deleteProduct(id) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async updateProductStatus(id, status) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
}
