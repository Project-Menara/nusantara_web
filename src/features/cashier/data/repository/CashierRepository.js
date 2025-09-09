import { ICashierRepository } from "../../domain/repository/ICashierRepository";
import { CashierEntity } from "../../domain/entities/CashierEntity";
import { left, right, ServerFailure } from "@/core/error/failure";
import { CashierResponseModel } from "../models/CashierResponseModel";
import { CashierRemoteSource } from "../source/CashierRemoteSource";

export class CashierRepository extends ICashierRepository {
  constructor() {
    super();
    this.remoteSource = new CashierRemoteSource();
  }

  async getCashiers(page = 1, search = "") {
    try {
      const response = await this.remoteSource.getCashiers(page, search);
      const model = CashierResponseModel.fromJSON(response);
      // ✅ BENAR: Hasilnya dibungkus dengan right()
      return right({
        cashiers: model.cashiers,
        pagination: model.pagination,
      });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal mengambil data kasir."
        )
      );
    }
  }

  async createCashier(formData) {
    try {
      const response = await this.remoteSource.createCashier(formData);
      // ✅ BENAR: Hasilnya dibungkus dengan right()
      return right(CashierEntity.fromJSON(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal membuat data kasir."
        )
      );
    }
  }

  async getCashierById(id) {
    try {
      const response = await this.remoteSource.getCashierById(id);
      // ✅ BENAR: Hasilnya dibungkus dengan right()
      return right(CashierEntity.fromJSON(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal mengambil detail kasir."
        )
      );
    }
  }

  async updateCashier(id, formData) {
    try {
      const response = await this.remoteSource.updateCashier(id, formData);
      // ✅ BENAR: Hasilnya dibungkus dengan right()
      return right(CashierEntity.fromJSON(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal memperbarui data kasir."
        )
      );
    }
  }

  async deleteCashier(id) {
    try {
      const response = await this.remoteSource.deleteCashier(id);
      // ✅ BENAR: Hasilnya dibungkus dengan right()
      return right(response.message);
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal menghapus kasir."
        )
      );
    }
  }

  async updateCashierStatus(id, status) {
    try {
      const response = await this.remoteSource.updateCashierStatus(id, status);
      // ✅ BENAR: Hasilnya dibungkus dengan right()
      return right(response.message);
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal memperbarui status kasir."
        )
      );
    }
  }
}
