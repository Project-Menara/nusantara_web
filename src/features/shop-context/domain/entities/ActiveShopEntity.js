export class ActiveShopEntity {
  constructor({ id, name, cover, description, fullAddress, lat, lang, status, shopImages }) {
    this.id = id;
    this.name = name;
    this.cover = cover;
    this.description = description;
    this.fullAddress = fullAddress;
    this.lat = lat;
    this.lang = lang;
    this.isActive = status === 1; // Konversi status 0/1 ke boolean
    this.shopImages = shopImages;
  }

  static fromJSON(json) {
    return new ActiveShopEntity({
      id: json.id,
      name: json.name,
      cover: json.cover,
      description: json.description,
      fullAddress: json.full_address, // snake_case ke camelCase
      lat: json.lat,
      lang: json.lang,
      status: json.status,
      shopImages: json.shop_images, // snake_case ke camelCase
    });
  }
}