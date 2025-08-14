export class CreateVoucherUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(formData) { return this.repository.createVoucher(formData); }
}