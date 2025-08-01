export class DeleteTypeProductUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id) {
    return this.repository.deleteTypeProduct(id);
  }
}
