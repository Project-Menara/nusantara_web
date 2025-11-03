// domain/entities/EventEntity.js

// Helper entity untuk produk yang ada di dalam event
export class ProductEntity {
  // ✅ HAPUS KURUNG KURAWAL DARI SINI
  constructor(inputData) { 
    
    // console.log("DI DALAM ProductEntity HELPER CONSTRUCTOR:", inputData);

    this.id = inputData.id;
    this.name = inputData.name;
    this.coverImage = inputData.image;
    this.code = inputData.code;
    this.price = inputData.price;
    this.unit = inputData.unit;
    this.description = inputData.description;
    this.status = inputData.status;
    this.typeProduct = inputData.product_images;
    this.coverImage = inputData.image || inputData.coverImage;
    // console.log("ProductEntity created with image:", this.coverImage);
  }
}

// Helper entity untuk item dalam bundle
export class EventBundleItemEntity {
  constructor({
    id,
    event,
    product,
    quantity,
    createdAt,
    updatedAt,
    deletedAt,
  }) {
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

// ✅ ENTITAS BARU untuk produk diskon
export class EventProductDiscountEntity {
  constructor({
    id,
    event,
    product,
    discountPercent,
    createdAt,
    updatedAt,
    deletedAt,
  }) {
    this.id = id;
    this.event = event;
    this.product = product ? new ProductEntity(product) : null;
    this.discountPercent = discountPercent;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}

// Entitas utama (diperbarui)
export class EventEntity {
  constructor({
    id,
    name,
    typeEvent,
    startDate,
    endDate,
    cover,
    status,
    eventProducts, // ✅ Ganti eventProduct menjadi eventProducts
    eventBundleBuy,
    eventBundleReward,
    createdBy,
    createdAt,
    updatedAt,
    deletedAt,
  }) {
    this.id = id;
    this.name = name;
    this.typeEvent = typeEvent;
    this.startDate = startDate;
    this.endDate = endDate;
    this.cover = cover;
    this.status = status;

    // ✅ Map array produk diskon ke entitas yang sesuai
    this.eventProducts =
      eventProducts?.map((item) => new EventProductDiscountEntity(item)) || [];

    this.eventBundleBuy =
      eventBundleBuy?.map((item) => new EventBundleItemEntity(item)) || [];
    this.eventBundleReward =
      eventBundleReward?.map((item) => new EventBundleItemEntity(item)) || [];
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
