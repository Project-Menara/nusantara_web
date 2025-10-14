// domain/entities/EventEntity.js

// Helper entity untuk produk yang ada di dalam event
export class ProductEntity {
  constructor({
    id, name, image, code, price, unit, description, status,
    typeProduct, productImages, createdBy, createdAt, updatedAt, deletedAt
  }) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.code = code;
    this.price = price;
    this.unit = unit;
    this.description = description;
    this.status = status;
    this.typeProduct = typeProduct;
    this.productImages = productImages;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}

// Helper entity untuk item dalam bundle
export class EventBundleItemEntity {
  constructor({ id, event, product, quantity, createdAt, updatedAt, deletedAt }) {
    this.id = id;
    this.event = event;
    // Pastikan product di-map ke ProductEntity
    this.product = product ? new ProductEntity(product) : null;
    this.quantity = quantity;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}

// Entitas utama
export class EventEntity {
  constructor({
    id, name, typeEvent, startDate, endDate, cover, status,
    eventProduct, eventBundleBuy, eventBundleReward,
    createdBy, createdAt, updatedAt, deletedAt
  }) {
    this.id = id;
    this.name = name;
    this.typeEvent = typeEvent;
    this.startDate = startDate;
    this.endDate = endDate;
    this.cover = cover;
    this.status = status; // Kita biarkan 0/1 sesuai API, mapping ke boolean bisa di-handle di presentation jika perlu
    this.eventProduct = eventProduct;
    // Map array ke entitas yang sesuai
    this.eventBundleBuy = eventBundleBuy?.map(item => new EventBundleItemEntity(item)) || [];
    this.eventBundleReward = eventBundleReward?.map(item => new EventBundleItemEntity(item)) || [];
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}