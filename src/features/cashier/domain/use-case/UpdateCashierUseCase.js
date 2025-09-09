// Logika bisnis khusus untuk memperbarui data kasir.
export class UpdateCashierUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, data) {
    return await this.repository.updateCashier(id, data);
  }
}
