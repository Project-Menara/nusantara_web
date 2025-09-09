// Logika bisnis khusus untuk mengubah status aktif/nonaktif kasir.
export class UpdateCashierStatusUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, status) {
    return await this.repository.updateCashierStatus(id, status);
  }
}
