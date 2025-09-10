import { IShopRepository } from "../repository/IShopRepository";

export class UpdateShopUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, formData) {
    return await this.repository.updateShop(id, formData);
  }
}
