// File: src/features/voucher/domain/use-case/GetVouchersUseCase.js
export class GetVouchersUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(page = 1, search = "") {
    return this.repository.getVouchers(page, search);
  }
}