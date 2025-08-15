export class UpdateProductUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id, formData) { return this.repository.updateProduct(id, formData); }
}