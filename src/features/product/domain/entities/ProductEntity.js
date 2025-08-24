export class ProductEntity {
  constructor({
    id,
    name,
    coverImage, // Kita sederhanakan objek 'image' menjadi URL string
    code,
    price,
    unit,
    description,
    isActive,
    typeProductId,
    typeProductName,
    productImages,
    createdBy,
    createdAt,
  }) {
    this.id = id;
    this.name = name;
    this.coverImage = coverImage;
    this.code = code;
    this.price = price;
    this.unit = unit;
    this.description = description;
    this.isActive = isActive;
    this.typeProductId = typeProductId;
    this.typeProductName = typeProductName;
    this.productImages = productImages;
    this.createdBy = createdBy;
    this.createdAt = new Date(createdAt);
  }
  // / Tambahkan static method ini
  static fromJSON(json) {
    return new ProductEntity({
      id: json.id,
      name: json.name,
      coverImage: json.image?.image_path || null,
      code: json.code,
      price: json.price,
      unit: json.unit,
      description: json.description,
      isActive: json.status === 1,
      typeProductId: json.type_product?.id || null,
      typeProductName: json.type_product?.name || "N/A",
      productImages:
        json.product_images?.map((img) => img.image?.image_path) || [],
      createdBy: json.created_by?.name || "N/A",
      createdAt: json.created_at,
    });
  }
}
