import { IShopRepository } from "../repository/IShopRepository";

export class GetShopByIdUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(id) {
    return await this.repository.getShopById(id);
  }
}
