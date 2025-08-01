export class UpdateTypeProductStatusUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id, status) { return this.repository.updateTypeProductStatus(id, status); }
}