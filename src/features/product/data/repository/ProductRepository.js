// File: src/features/product/data/repository/ProductRepository.js
import { IProductRepository } from "../../domain/repository/IProductRepository";
import { ProductEntity } from "../../domain/entities/ProductEntity";
import { left, right, ServerFailure } from "@/core/error/failure";
import { ProductResponseModel } from "../model/ProductResponseModel";
import { ProductRemoteSource } from "../source/ProductRemoteSource";

// Helper untuk mapping satu objek, karena akan sering dipakai
const mapDataToEntity = (data) => {
  return new ProductEntity({
    id: data.id,
    name: data.name,
    coverImage: data.image?.image_path || null,
    code: data.code,
    price: data.price,
    unit: data.unit,
    description: data.description,
    isActive: data.status === 1,
    typeProductName: data.type_product?.name || "N/A",
    productImages:
      data.product_images?.map((img) => img.image?.image_path) || [],
    createdBy: data.created_by?.name || "N/A",
    createdAt: data.created_at,
  });
};

export class ProductRepository extends IProductRepository {
  constructor() {
    super();
    this.remoteSource = new ProductRemoteSource();
  }

  async getProducts(page = 1, search = "") {
    try {
      const response = await this.remoteSource.getProducts(page, search);
      const model = ProductResponseModel.fromJSON(response);
      console.log(">>>>>>>");
      return right({
        products: model.products,
        pagination: model.pagination,
      });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal mengambil data produk."
        )
      );
    }
  }

  async createProduct(formData) {
    try {
      const response = await this.remoteSource.createProduct(formData);
      // return right(mapDataToEntity(response.data));
      return right(ProductEntity.fromJSON(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal membuat produk."
        )
      );
    }
  }

  async getProductById(id) {
    try {
      const response = await this.remoteSource.getProductById(id);
      // return right(mapDataToEntity(response.data));
      return right(ProductEntity.fromJSON(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal mengambil detail produk."
        )
      );
    }
  }

  async updateProduct(id, formData) {
    try {
      const response = await this.remoteSource.updateProduct(id, formData);
      // return right(mapDataToEntity(response.data));
      return right(ProductEntity.fromJSON(response.data));
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal memperbarui produk."
        )
      );
    }
  }

  async deleteProduct(id) {
    try {
      const response = await this.remoteSource.deleteProduct(id);
      return right({ message: response.message });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal menghapus produk."
        )
      );
    }
  }

  async updateProductStatus(id, status) {
    try {
      const response = await this.remoteSource.updateProductStatus(id, status);
      // Untuk update status, biasanya kita hanya butuh pesan sukses
      return right({ message: response.message });
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "Gagal memperbarui status produk."
        )
      );
    }
  }
}
