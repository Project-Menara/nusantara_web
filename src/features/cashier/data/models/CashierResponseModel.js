// cashierResponseModel.js
import { CashierEntity } from "../../domain/entities/CashierEntity";
import { PaginationEntity } from "@/core/domain/entities/PaginationEntity";

// Model untuk mem-parsing respons daftar kasir dari API.
export class CashierResponseModel {
  constructor({ cashiers, pagination }) {
    this.cashiers = cashiers;
    this.pagination = pagination;
  }

  static fromJSON(json) {
    const cashiers = json.data.map((item) => CashierEntity.fromJSON(item));

    const pagination = new PaginationEntity({
      currentPage: json.pagination.current_page,
      perPage: json.pagination.per_page,
      totalData: json.pagination.total_data,
      totalPages: json.pagination.total_pages,
    });

    return new CashierResponseModel({ cashiers, pagination });
  }
}
