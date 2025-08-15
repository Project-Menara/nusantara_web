export class CreateProductUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(formData) { return this.repository.createProduct(formData); }
}