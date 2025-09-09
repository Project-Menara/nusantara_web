// Logika bisnis khusus untuk menghapus kasir.
export class DeleteCashierUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    return await this.repository.deleteCashier(id);
  }
}
