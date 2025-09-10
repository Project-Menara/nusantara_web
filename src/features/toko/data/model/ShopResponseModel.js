import { ShopEntity } from "../../domain/entities/ShopEntity";
import { PaginationEntity } from "@/core/domain/entities/PaginationEntity";

export class ShopResponseModel {
  constructor({ shops, pagination }) {
    this.shops = shops;
    this.pagination = pagination;
  }

  static fromJSON(json) {
    const shops = json.data.map(item => ShopEntity.fromJSON(item));
    const pagination = new PaginationEntity(json.pagination);
    return new ShopResponseModel({ shops, pagination });
  }
}
