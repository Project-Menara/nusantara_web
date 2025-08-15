export class UpdateProductStatusUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id, status) { return this.repository.updateProductStatus(id, status); }
}