export class DeleteVoucherUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id) { return this.repository.deleteVoucher(id); }
}