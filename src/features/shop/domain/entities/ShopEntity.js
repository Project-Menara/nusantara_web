// Mengimpor entitas anak untuk relasi
import { ProductEntity } from '@/features/product/domain/entities/ProductEntity';
import { CashierEntity } from '@/features/cashier/domain/entities/CashierEntity';

export class ShopEntity {
  constructor({
    id, name, cover, description, fullAddress, lat, lng, isActive,
    createdBy, createdAt, gallery, products, cashiers,
  }) {
    this.id = id;
    this.name = name;
    this.cover = cover;
    this.description = description;
    this.fullAddress = fullAddress;
    this.lat = lat;
    this.lng = lng;
    this.isActive = isActive;
    this.createdBy = createdBy;
    this.createdAt = new Date(createdAt);
    this.gallery = gallery; // Array of image URLs
    this.products = products; // Array of ProductEntity
    this.cashiers = cashiers; // Array of CashierEntity
  }

  static fromJSON(json) {
    return new ShopEntity({
      id: json.id,
      name: json.name,
      cover: json.cover,
      description: json.description,
      fullAddress: json.full_address,
      lat: json.lat,
      lng: json.lang, // Perhatikan: API menggunakan 'lang', kita map ke 'lng'
      isActive: json.status === 1,
      createdBy: json.created_by,
      createdAt: json.created_at,
      gallery: json.shop_images || [],
      // Mapping data relasi ke entitasnya masing-masing
      products: (json.shop_product || []).map(p => ProductEntity.fromJSON(p)),
      cashiers: (json.shop_cashier || []).map(c => CashierEntity.fromJSON(c)),
    });
  }
}
