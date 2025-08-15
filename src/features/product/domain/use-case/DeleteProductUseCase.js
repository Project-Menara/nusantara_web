export class DeleteProductUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id) { return this.repository.deleteProduct(id); }
}