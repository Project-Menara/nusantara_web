import { IShopRepository } from "../repository/IShopRepository";

export class GetShopsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(page, search) {
    return await this.repository.getShops(page, search);
  }
}
