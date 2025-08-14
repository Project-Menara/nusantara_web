export class UpdateVoucherStatusUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id, status) { return this.repository.updateVoucherStatus(id, status); }
}