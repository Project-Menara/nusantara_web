export class DeleteBannerUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id) { return this.repository.deleteBanner(id); }
}