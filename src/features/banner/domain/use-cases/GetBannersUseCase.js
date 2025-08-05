// GetBannersUseCase.js
export class GetBannersUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(page = 1, search = "") {
    return this.repository.getBanners(page, search);
  }
}