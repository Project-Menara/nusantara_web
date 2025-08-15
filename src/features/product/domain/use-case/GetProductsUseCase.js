// File: src/features/Product/domain/use-case/GetProductsUseCase.js
export class GetProductsUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(page = 1, search = "") {
    return this.repository.getProducts(page, search);
  }
}