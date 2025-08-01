import { ITypeProductRepository } from "../../domain/repository/ITypeProductRepository";
import { TypeProductEntity } from "../../domain/entities/TypeProductEntity";
import { left, right, ServerFailure } from "@/core/error/failure.js";
import {
  TypeProductResponseModel,
  TypeProductModel,
} from "../models/TypeProductResponseModel";
import { TypeProductRemoteSource } from "../source/TypeProductRemoteSource";

const mapModelToEntity = (model) => {
  return new TypeProductEntity({
    id: model.id,
    name: model.name,
    image: model.image,
    isActive: model.status === 1,
  });
};

export class TypeProductRepository extends ITypeProductRepository {
  constructor() {
    super();
    this.remoteSource = new TypeProductRemoteSource();
  }

  async getTypeProducts(page = 1) {
    try {
      const response = await this.remoteSource.getTypeProducts(page);
      const model = TypeProductResponseModel.fromJSON(response);
      return right({
        typeProducts: model.typeProducts.map(mapModelToEntity),
        pagination: model.pagination,
      });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal mengambil data."
        )
      );
    }
  }

  async createTypeProduct(formData) {
    try {
      const response = await this.remoteSource.createTypeProduct(formData);
      return right(mapModelToEntity(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal membuat tipe produk."
        )
      );
    }
  }

  async getTypeProductById(id) {
    try {
      const response = await this.remoteSource.getTypeProductById(id);
      return right(mapModelToEntity(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal mengambil detail."
        )
      );
    }
  }

  async updateTypeProduct(id, formData) {
    try {
      const response = await this.remoteSource.updateTypeProduct(id, formData);
      return right(mapModelToEntity(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal memperbarui tipe produk."
        )
      );
    }
  }

  async updateTypeProductStatus(id, status) {
    try {
      await this.remoteSource.updateTypeProductStatus(id, status);
      return right({ message: "Status berhasil diperbarui" });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal memperbarui status."
        )
      );
    }
  }

  async deleteTypeProduct(id) {
    try {
      const response = await this.remoteSource.deleteTypeProduct(id);
      return right({ message: response.message });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal menghapus data."
        )
      );
    }
  }
}
