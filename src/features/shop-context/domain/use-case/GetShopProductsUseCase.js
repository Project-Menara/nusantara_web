export class GetShopProductsUseCase {
  constructor(shopContextRepository) {
    this.repository = shopContextRepository;
  }

  /**
   * Mengambil daftar produk yang tersedia di toko yang dipilih.
   * @param {string} shopId 
   */
  async execute(shopId) {
    return await this.repository.getShopProducts(shopId);
  }
}