export class GetVoucherByIdUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id) { return this.repository.getVoucherById(id); }
}