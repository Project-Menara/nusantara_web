// Path: src/features/type-product/domain/use-case/GetTypeProductsByIdUseCase.js
export class GetTypeProductByIdUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id) {
    return this.repository.getTypeProductById(id);
  }
}
