export class GetProductByIdUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id) { return this.repository.getProductById(id); }
}