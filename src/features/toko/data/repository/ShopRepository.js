import { IShopRepository } from "../../domain/repository/IShopRepository";
import { ShopResponseModel } from "../model/ShopResponseModel";
import { ShopRemoteSource } from "../source/ShopRemoteSource";
import { left, right } from "@/core/error/failure";
import { ServerFailure } from "@/core/error/failure";
import { ShopEntity } from "../../domain/entities/ShopEntity";

export class ShopRepository extends IShopRepository {
  constructor() {
    super();
    this.remoteSource = new ShopRemoteSource();
  }

  async getShops(page = 1, search = "") {
    try {
      const response = await this.remoteSource.getShops(page, search);
      const model = ShopResponseModel.fromJSON(response);
      return right({
        shops: model.shops,
        pagination: model.pagination,
      });
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal mengambil data toko."));
    }
  }

  async createShop(formData) {
    try {
      const response = await this.remoteSource.createShop(formData);
      return right(response.message);
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal membuat data toko."));
    }
  }

  async getShopById(id) {
     try {
      const response = await this.remoteSource.getShopById(id);
      return right(ShopEntity.fromJSON(response.data));
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal mengambil detail toko."));
    }
  }

  async updateShop(id, formData) {
    try {
      const response = await this.remoteSource.updateShop(id, formData);
      return right(response.message);
    } catch (error) {
       return left(new ServerFailure(error.response?.data?.message || "Gagal memperbarui data toko."));
    }
  }

  async deleteShop(id) {
    try {
      const response = await this.remoteSource.deleteShop(id);
      return right(response.message);
    } catch (error) {
       return left(new ServerFailure(error.response?.data?.message || "Gagal menghapus toko."));
    }
  }
  
  async updateShopStatus(id, status) {
     try {
      const response = await this.remoteSource.updateShopStatus(id, status);
      return right(response.message);
    } catch (error) {
       return left(new ServerFailure(error.response?.data?.message || "Gagal memperbarui status toko."));
    }
  }
}
