// BannerResponseModel.js
import { BannerEntity } from "../../domain/entities/BannerEntity";
import { PaginationEntity } from "../../domain/entities/PaginationEntity";

export class BannerResponseModel {
  constructor({ banners, pagination }) {
    this.banners = banners;
    this.pagination = pagination;
  }

  static fromJSON(json) {
    const banners = json.data.map(
      (item) =>
        new BannerEntity({
          id: item.id,
          name: item.name,
          photo: item.photo,
          description: item.description,
          isActive: item.status === 1,
        })
    );

    const pagination = new PaginationEntity({
      currentPage: json.pagination.current_page,
      perPage: json.pagination.per_page,
      totalData: json.pagination.total_data,
      totalPages: json.pagination.total_pages,
    });

    return new BannerResponseModel({ banners, pagination });
  }
}
