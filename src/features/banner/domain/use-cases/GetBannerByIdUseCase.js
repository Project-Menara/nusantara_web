// GetBannerByIdUseCase.js
export class GetBannerByIdUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id) {
    return this.repository.getBannerById(id);
  }
}
