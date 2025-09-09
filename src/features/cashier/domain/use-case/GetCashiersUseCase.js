// Seharusnya seperti ini di GetCashiersUseCase.js
export class GetCashiersUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(page, search) {
    // BENAR: Langsung mengembalikan hasil dari repository (yang sudah berupa Either)
    return await this.repository.getCashiers(page, search);
  }
}
