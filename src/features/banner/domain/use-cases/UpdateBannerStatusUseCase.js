// UpdateBannerStatusUseCase.js
export class UpdateBannerStatusUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id, status) { return this.repository.updateBannerStatus(id, status); }
}