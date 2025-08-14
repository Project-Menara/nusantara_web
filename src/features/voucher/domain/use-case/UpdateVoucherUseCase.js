export class UpdateVoucherUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id, formData) { return this.repository.updateVoucher(id, formData); }
}