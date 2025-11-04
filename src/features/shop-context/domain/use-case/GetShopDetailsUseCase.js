export class GetShopDetailsUseCase {
  constructor(shopContextRepository) {
    this.repository = shopContextRepository;
  }

  /**
   * Mengambil detail lengkap dari satu toko yang dipilih.
   * @param {string} shopId 
   */
  async execute(shopId) {
    return await this.repository.getShopDetails(shopId);
  }
}