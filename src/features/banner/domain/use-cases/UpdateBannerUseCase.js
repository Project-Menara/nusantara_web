// UpdateBannerUseCase.js
export class UpdateBannerUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id, formData) { return this.repository.updateBanner(id, formData); }
}