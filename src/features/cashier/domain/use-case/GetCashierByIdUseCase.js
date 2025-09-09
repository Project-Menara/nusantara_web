// Logika bisnis khusus untuk mengambil detail satu kasir.
export class GetCashierByIdUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    return await this.repository.getCashierById(id);
  }
}
