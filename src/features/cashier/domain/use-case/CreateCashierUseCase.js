// Logika bisnis khusus untuk membuat kasir baru.
export class CreateCashierUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(data) {
    return await this.repository.createCashier(data);
  }
}
