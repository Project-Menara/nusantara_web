import { ProductEntity } from "../../domain/entities/ProductEntity";
import { PaginationEntity } from "@/core/domain/entities/PaginationEntity";

export class ProductResponseModel {
  constructor({ products, pagination }) {
    this.products = products;
    this.pagination = pagination;
  }

  static fromJSON(json) {
    const products = json.data.map(
      (item) =>
        new ProductEntity({
          id: item.id,
          name: item.name,
          // Ambil URL gambar dari objek bersarang
          coverImage: item.image?.image_path || null,
          code: item.code,
          price: item.price,
          unit: item.unit,
          description: item.description,
          isActive: item.status === 1,
          // Ambil hanya nama dari tipe produk
          typeProductName: item.type_product?.name || 'N/A',
          // Ubah array objek gambar menjadi array URL string
          productImages: item.product_images?.map(img => img.image?.image_path) || [],
          createdBy: item.created_by?.name || 'N/A',
          createdAt: item.created_at,
        })
    );

    const pagination = new PaginationEntity({
      currentPage: json.pagination.current_page,
      perPage: json.pagination.per_page,
      totalData: json.pagination.total_data,
      totalPages: json.pagination.total_pages,
    });

    return new ProductResponseModel({ products, pagination });
  }
}