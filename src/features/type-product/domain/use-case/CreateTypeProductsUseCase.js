export class CreateTypeProductUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(formData) {
    return this.repository.createTypeProduct(formData);
  }
}
