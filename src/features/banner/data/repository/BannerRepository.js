import { IBannerRepository } from "../../domain/repository/IBannerRepository";
import { BannerEntity } from "../../domain/entities/BannerEntity";
import { PaginationEntity } from "../../domain/entities/PaginationEntity";
import { left, right, ServerFailure } from "@/core/error/failure";
import { BannerResponseModel } from "../models/BannerResponseModel";
import { BannerRemoteSource } from "../source/BannerRemoteSource";

// Helper untuk mapping model ke entity, agar tidak berulang
const mapModelToEntity = (model) => {
  return new BannerEntity({
    id: model.id,
    name: model.name,
    photo: model.photo,
    description: model.description,
    isActive: model.status === 1,
  });
};

export class BannerRepository extends IBannerRepository {
  constructor() {
    super();
    this.remoteSource = new BannerRemoteSource();
  }

  async getBanners(page = 1) {
    try {
      const response = await this.remoteSource.getBanners(page);
      const bannerResponseModel = BannerResponseModel.fromJSON(response);

      const banners = bannerResponseModel.banners.map((model) =>
        mapModelToEntity(model)
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
      return right(mapModelToEntity(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal membuat banner."
        )
      );
    }
  }

  async getBannerById(id) {
    try {
      const response = await this.remoteSource.getBannerById(id);
      return right(mapModelToEntity(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal mengambil detail banner."
        )
      );
    }
  }

  async updateBanner(id, formData) {
    try {
      const response = await this.remoteSource.updateBanner(id, formData);
      return right(mapModelToEntity(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal memperbarui banner."
        )
      );
    }
  }

  async updateBannerStatus(id, status) {
    try {
      // Panggil API
      const response = await this.remoteSource.updateBannerStatus(id, status);
      // PERBAIKAN: Jika sukses, cukup kembalikan pesan suksesnya.
      return right({ message: response.message });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal memperbarui status banner."
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
}
