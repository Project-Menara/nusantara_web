// TypeProductResponseModel.js
import { PaginationEntity } from "@/core/domain/entities/PaginationEntity";
import { TypeProductEntity } from "../../domain/entities/TypeProductEntity";

export class TypeProductResponseModel {
  constructor({ typeProducts, pagination }) {
    this.typeProducts = typeProducts;
    this.pagination = pagination;
  }

  static fromJSON(json) {
    const typeProducts = json.data.map(
      (item) =>
        // Langsung map ke TypeProductEntity untuk penyederhanaan
        new TypeProductEntity({
          id: item.id,
          name: item.name,
          image: item.image,
          isActive: item.status === 1,
        })
    );

    // ✅ PERBAIKAN UTAMA DI SINI
    // Lakukan mapping dari snake_case (API) ke camelCase (Entity)
    const pagination = new PaginationEntity({
      currentPage: json.pagination.current_page,
      totalPages: json.pagination.total_pages,
      totalData: json.pagination.total_data,
      perPage: json.pagination.per_page,
    });

    return new TypeProductResponseModel({ typeProducts, pagination });
  }
}
