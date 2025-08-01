export class GetTypeProductsUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(page = 1) {
    return this.repository.getTypeProducts(page);
  }
}
