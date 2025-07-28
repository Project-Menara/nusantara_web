export class CreateBannerUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(formData) { return this.repository.createBanner(formData); }
}