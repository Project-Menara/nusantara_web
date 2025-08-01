export class UpdateTypeProductUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id, formData) {
    return this.repository.updateTypeProduct(id, formData);
  }
}
