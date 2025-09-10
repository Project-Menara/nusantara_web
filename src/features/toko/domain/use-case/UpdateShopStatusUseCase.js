import { IShopRepository } from "../repository/IShopRepository";

export class UpdateShopStatusUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id, status) {
    return await this.repository.updateShopStatus(id, status);
  }
}
