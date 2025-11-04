export class ShopProductEntity {
  constructor({ 
    id, name, image, code, price, unit, stock, description, 
    status, typeProduct, productImages 
  }) {
    this.id = id;
    this.name = name;
    this.coverImage = image; // Mapping 'image' ke 'coverImage' agar konsisten
    this.code = code;
    this.price = price;
    this.unit = unit;
    this.stock = stock;
    this.description = description;
    this.isActive = status === 1;
    this.typeProduct = typeProduct;
    this.productImages = productImages;
  }

  static fromJSON(json) {
    return new ShopProductEntity({
      id: json.id,
      name: json.name,
      image: json.image,
      code: json.code,
      price: json.price,
      unit: json.unit,
      stock: json.stock,
      description: json.description,
      status: json.status,
      typeProduct: json.type_product, // snake_case ke camelCase
      productImages: json.product_images, // snake_case ke camelCase
    });
  }
}