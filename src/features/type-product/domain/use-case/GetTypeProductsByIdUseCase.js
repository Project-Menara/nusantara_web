export class GetTypeProductByIdUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id) {
    return this.repository.getTypeProductById(id);
  }
}
