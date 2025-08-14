// File: src/features/voucher/data/models/VoucherResponseModel.js
import { VoucherEntity } from "../../domain/entities/VoucherEntity";
import { PaginationEntity } from "@/core/domain/entities/PaginationEntity";

// export class VoucherResponseModel {
//   constructor({ vouchers, pagination }) {
//     this.vouchers = vouchers;
//     this.pagination = pagination;
//   }

//   static fromJSON(json) {
//     const vouchers = json.data.map(
//       (item) =>
//         new VoucherEntity({
//           id: item.id,
//           code: item.code,
//           discountAmount: item.discount_amount,
//           discountPercent: item.discount_percent,
//           minimumSpend: item.minimum_spend,
//           pointCost: item.point_cost,
//           startDate: item.start_date,
//           endDate: item.end_date,
//           quota: item.quota,
//           claimedCount: item.claimed_count,
//           description: item.description,
//           discountType: item.discount_type,
//           isActive: item.status === 1,
//           createdAt: item.created_at,
//         })
//     );

//     const pagination = new PaginationEntity({
//       currentPage: json.pagination.current_page,
//       perPage: json.pagination.per_page,
//       totalData: json.pagination.total_data,
//       totalPages: json.pagination.total_pages,
//     });

//     return new VoucherResponseModel({ vouchers, pagination });
//   }
// }

export class VoucherResponseModel {
  constructor({ vouchers, pagination }) {
    this.vouchers = vouchers;
    this.pagination = pagination;
  }

  static fromJSON(json) {
    const vouchers = json.data.map((item) => {
      console.log("Mapping item:", item);
      // ✅ PERBAIKAN: Tambahkan 'return' di sini
      return new VoucherEntity({
        id: item.id,
        code: item.code,
        discountAmount: item.discount_amount,
        discountPercent: item.discount_percent,
        minimumSpend: item.minimum_spend,
        pointCost: item.point_cost,
        startDate: item.start_date,
        endDate: item.end_date,
        quota: item.quota,
        claimedCount: item.claimed_count,
        description: item.description,
        discountType: item.discount_type,
        isActive: item.status === 1,
        createdAt: item.created_at,
      });
    });

    const pagination = new PaginationEntity({
      currentPage: json.pagination.current_page,
      perPage: json.pagination.per_page,
      totalData: json.pagination.total_data,
      totalPages: json.pagination.total_pages,
    });

    return new VoucherResponseModel({ vouchers, pagination });
  }
}
