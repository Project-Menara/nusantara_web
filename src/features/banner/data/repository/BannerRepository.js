import { IBannerRepository } from "../../domain/repository/IBannerRepository";
import { BannerEntity } from "../../domain/entities/BannerEntity";
import { PaginationEntity } from "../../domain/entities/PaginationEntity";
import { left, right, ServerFailure } from "@/core/error/failure";
import { BannerResponseModel } from "../models/BannerResponseModel";
import { BannerRemoteSource } from "../source/BannerRemoteSource";

export class BannerRepository extends IBannerRepository {
  constructor() {
    super();
    this.remoteSource = new BannerRemoteSource();
  }

  async getBanners(page = 1) {
    try {
      const response = await this.remoteSource.getBanners(page);
      const bannerResponseModel = BannerResponseModel.fromJSON(response);

      const banners = bannerResponseModel.banners.map(
        (model) =>
          new BannerEntity({
            id: model.id,
            name: model.name,
            photo: model.photo,
            description: model.description,
            isActive: model.status === 1, // Konversi status 0/1 ke boolean
          })
      );

      const pagination = new PaginationEntity(bannerResponseModel.pagination);

      return right({ banners, pagination });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal mengambil data banner."
        )
      );
    }
  }
  async createBanner(formData) {
    try {
      const response = await this.remoteSource.createBanner(formData);
      const model = BannerModel.fromJSON(response.data);
      const entity = new BannerEntity({
        /* ... mapping ... */
      });
      return right(entity);
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal membuat banner."
        )
      );
    }
  }

  async updateBanner(id, formData) {
    try {
      const response = await this.remoteSource.updateBanner(id, formData);
      const model = BannerModel.fromJSON(response.data);
      const entity = new BannerEntity({
        /* ... mapping ... */
      });
      return right(entity);
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal memperbarui banner."
        )
      );
    }
  }

  async deleteBanner(id) {
    try {
      const response = await this.remoteSource.deleteBanner(id);
      return right({ message: response.message });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal menghapus banner."
        )
      );
    }
  }

  async getBannerById(id) {
    try {
      const response = await this.remoteSource.getBannerById(id);
      const model = BannerModel.fromJSON(response.data);
      const entity = new BannerEntity({
        /* ... mapping ... */
      });
      return right(entity);
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal mengambil detail banner."
        )
      );
    }
  }
}
