// Path: src/features/type-product/data/repository/TypeProductRepository.js
import { ITypeProductRepository } from "../../domain/repository/ITypeProductRepository";
import { TypeProductEntity } from "../../domain/entities/TypeProductEntity";
import { left, right, ServerFailure } from "@/core/error/failure.js";
import { TypeProductResponseModel } from "../models/TypeProductResponseModel";
import { TypeProductRemoteSource } from "../source/TypeProductRemoteSource";

export class TypeProductRepository extends ITypeProductRepository {
  constructor() {
    super();
    this.remoteSource = new TypeProductRemoteSource();
  }

  async getTypeProducts(page = 1, search = "") {
    try {
      const response = await this.remoteSource.getTypeProducts(page, search);
      const model = TypeProductResponseModel.fromJSON(response);
      return right({
        typeProducts: model.typeProducts,
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
      // ✅ Perbaikan: Mapping satu objek 'response.data' ke TypeProductEntity
      const newEntity = new TypeProductEntity({
        id: response.data.id,
        name: response.data.name,
        image: response.data.image,
        isActive: response.data.status === 1,
      });
      return right(newEntity);
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
      // ✅ Perbaikan: Mapping satu objek 'response.data' ke TypeProductEntity
      const entity = new TypeProductEntity({
        id: response.data.id,
        name: response.data.name,
        image: response.data.image,
        isActive: response.data.status === 1,
      });
      return right(entity);
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
      // ✅ Perbaikan: Mapping satu objek 'response.data' ke TypeProductEntity
      const updatedEntity = new TypeProductEntity({
        id: response.data.id,
        name: response.data.name,
        image: response.data.image,
        isActive: response.data.status === 1,
      });
      return right(updatedEntity);
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
