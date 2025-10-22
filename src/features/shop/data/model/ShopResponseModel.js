import { ShopEntity } from "../../domain/entities/ShopEntity";
import { PaginationEntity } from "@/core/domain/entities/PaginationEntity";

export class ShopResponseModel {
  constructor({ shops, pagination }) {
    this.shops = shops;
    this.pagination = pagination;
  }

  static fromJSON(json) {
    const shops = json.data.map(item => ShopEntity.fromJSON(item));
    const pagination = new PaginationEntity({
      currentPage: json.pagination.current_page,
      perPage: json.pagination.per_page,
      totalData: json.pagination.total_data,
      totalPages: json.pagination.total_pages
    });
    return new ShopResponseModel({ shops, pagination });
  }
}
