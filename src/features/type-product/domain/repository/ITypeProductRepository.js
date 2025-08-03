// Path: src/features/type-product/domain/repository/ITypeProductRepository.js
export class ITypeProductRepository {
  async getTypeProducts(page = 1, search = "") {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async createTypeProduct(formData) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async getTypeProductById(id) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async updateTypeProduct(id, formData) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async updateTypeProductStatus(id, status) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async deleteTypeProduct(id) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
}
