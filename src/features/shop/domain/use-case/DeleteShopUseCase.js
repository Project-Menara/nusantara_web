import { IShopRepository } from "../repository/IShopRepository";

export class DeleteShopUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    return await this.repository.deleteShop(id);
  }
}
