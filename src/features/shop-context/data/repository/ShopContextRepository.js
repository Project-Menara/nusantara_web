import { IShopContextRepository } from '../../domain/repository/IShopContextRepository';
import { ShopContextRemoteSource } from '../source/ShopContextRemoteSource';
import { AssignedShopEntity } from '../../domain/entities/AssignedShopEntity';
import { ActiveShopEntity } from '../../domain/entities/ActiveShopEntity';
import { ShopProductEntity } from '../../domain/entities/ShopProductEntity';
import { left, right } from "@/core/error/failure";
import { ServerFailure } from "@/core/error/failure";

export class ShopContextRepository extends IShopContextRepository {
  constructor() {
    super();
    this.remoteSource = new ShopContextRemoteSource();
  }

  async getAvailableShops() {
    try {
      const response = await this.remoteSource.getAvailableShops();
      // response.data adalah array [ {id, name}, ... ]
      const entities = response.data.map(item => AssignedShopEntity.fromJSON(item));
      return right(entities);
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal mengambil daftar toko."));
    }
  }

  async getShopDetails(shopId) {
    try {
      const response = await this.remoteSource.getShopDetails(shopId);
      // response.data adalah objek { id, name, ... }
      const entity = ActiveShopEntity.fromJSON(response.data);
      return right(entity);
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal mengambil detail toko."));
    }
  }

  async getShopProducts(shopId) {
    try {
      const response = await this.remoteSource.getShopProducts(shopId);
      // response.data adalah array [ {id, name, ...}, ... ]
      const entities = response.data.map(item => ShopProductEntity.fromJSON(item));
      return right(entities);
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal mengambil produk toko."));
    }
  }
}