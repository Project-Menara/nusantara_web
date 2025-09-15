import { IShopRepository } from "../repository/IShopRepository";

export class CreateShopUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(formData) {
    return await this.repository.createShop(formData);
  }
}
