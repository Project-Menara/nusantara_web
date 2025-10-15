import { ProductEntity } from "../../domain/entities/ProductEntity";
import { PaginationEntity } from "@/core/domain/entities/PaginationEntity";

export class ProductResponseModel {
  constructor({ products, pagination }) {
    this.products = products;
    this.pagination = pagination;
  }

  static fromJSON(json) {
    // ---- PERUBAHAN UTAMA DI SINI ----
    // Tidak ada lagi logika mapping yang panjang.
    // Kita panggil "pabrik" dari ProductEntity untuk setiap item.
    const products = json.data.map((item) => ProductEntity.fromJSON(item));
    // --------------------------------

    const pagination = new PaginationEntity({
      currentPage: json.pagination.current_page,
      perPage: json.pagination.per_page,
      totalData: json.pagination.total_data,
      totalPages: json.pagination.total_pages,
    });

    return new ProductResponseModel({ products, pagination });
  }
}
