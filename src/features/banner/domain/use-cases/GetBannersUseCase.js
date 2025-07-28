export class GetBannersUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(page = 1) {
    return this.repository.getBanners(page);
  }
}
// Buat juga use case untuk Create, Update, dan Delete Banner