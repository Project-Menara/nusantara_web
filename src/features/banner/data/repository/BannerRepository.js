// BannerRepository.js
import { IBannerRepository } from "../../domain/repository/IBannerRepository";
import { left, right, ServerFailure } from "@/core/error/failure";
import { BannerResponseModel } from "../models/BannerResponseModel";
import { BannerRemoteSource } from "../source/BannerRemoteSource";
import { BannerEntity } from "../../../banner/domain/entities/BannerEntity";

export class BannerRepository extends IBannerRepository {
  constructor() {
    super();
    this.remoteSource = new BannerRemoteSource();
  }

  async getBanners(page = 1, search = "") {
    try {
      const response = await this.remoteSource.getBanners(page, search);
      const model = BannerResponseModel.fromJSON(response);

      // ✅ Langsung return hasil dari model yang sudah bersih
      return right({
        banners: model.banners,
        pagination: model.pagination,
      });
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
      const newEntity = new BannerEntity({
        id: response.data.id,
        name: response.data.name,
        photo: response.data.photo,
        description: response.data.description,
        isActive: response.data.status === 1,
      });
      return right(newEntity);
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
      const entity = new BannerEntity({
        id: response.data.id,
        name: response.data.name,
        photo: response.data.photo,
        description: response.data.description,
        isActive: response.data.status === 1,
      });
      console.log("Fetched Banner Entity:", entity);
      return right(entity);
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
      const updatedEntity = new BannerEntity({
        id: response.data.id,
        name: response.data.name,
        photo: response.data.photo,
        description: response.data.description,
        isActive: response.data.status === 1,
      });
      console.log("Updated Banner Entity:", updatedEntity);
      return right(updatedEntity);
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
