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
    typeProductName, // Kita ambil hanya nama tipe produk
    productImages, // Array berisi URL gambar galeri
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
    this.typeProductName = typeProductName;
    this.productImages = productImages;
    this.createdBy = createdBy;
    this.createdAt = new Date(createdAt);
  }
}