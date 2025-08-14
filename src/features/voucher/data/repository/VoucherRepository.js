// File: src/features/voucher/data/repository/VoucherRepository.js
import { VoucherEntity } from "../../domain/entities/VoucherEntity";
import { IVoucherRepository } from "../../domain/repository/IVoucherRepository";
import { left, right, ServerFailure } from "@/core/error/failure";
import { VoucherResponseModel } from "../models/VoucherResponseModel";
import { VoucherRemoteSource } from "../source/VoucherRemoteSource";

// Helper untuk mapping satu objek, agar tidak berulang
const mapDataToEntity = (data) => {
  return new VoucherEntity({
    id: data.id,
    code: data.code,
    discountAmount: data.discount_amount,
    discountPercent: data.discount_percent,
    minimumSpend: data.minimum_spend,
    pointCost: data.point_cost,
    startDate: data.start_date,
    endDate: data.end_date,
    quota: data.quota,
    claimedCount: data.claimed_count,
    description: data.description,
    discountType: data.discount_type,
    isActive: data.status === 1,
    createdAt: data.created_at,
  });
};

export class VoucherRepository extends IVoucherRepository {
  constructor() {
    super();
    this.remoteSource = new VoucherRemoteSource();
  }

  async getVouchers(page = 1, search = "") {
    try {
      const response = await this.remoteSource.getVouchers(page, search);
      const model = VoucherResponseModel.fromJSON(response);
      return right({
        vouchers: model.vouchers,
        pagination: model.pagination,
      });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal mengambil data voucher."
        )
      );
    }
  }
  async createVoucher(data) {
    try {
      const response = await this.remoteSource.createVoucher(data);
      return right(mapDataToEntity(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal membuat voucher."
        )
      );
    }
  }

  async getVoucherById(id) {
    try {
      const response = await this.remoteSource.getVoucherById(id);
      return right(mapDataToEntity(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal mengambil detail voucher."
        )
      );
    }
  }

  async updateVoucher(id, data) {
    try {
      const response = await this.remoteSource.updateVoucher(id, data);
      return right(mapDataToEntity(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal memperbarui voucher."
        )
      );
    }
  }

  async deleteVoucher(id) {
    try {
      const response = await this.remoteSource.deleteVoucher(id);
      return right({ message: response.message });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal menghapus voucher."
        )
      );
    }
  }

  async updateVoucherStatus(id, status) {
    try {
      const response = await this.remoteSource.updateVoucherStatus(id, status);
      return right({ message: response.message });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal memperbarui status voucher."
        )
      );
    }
  }
}
