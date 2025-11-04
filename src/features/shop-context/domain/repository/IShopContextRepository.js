export class IShopContextRepository {
  /**
   * Mengambil daftar nama toko yang ditugaskan ke kasir.
   * @returns {Promise<Either<Failure, AssignedShopEntity[]>>}
   */
  async getAvailableShops() {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Mengambil detail lengkap dari satu toko yang dipilih.
   * @param {string} shopId 
   * @returns {Promise<Either<Failure, ActiveShopEntity>>}
   */
  async getShopDetails(shopId) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Mengambil daftar produk yang tersedia di toko yang dipilih.
   * @param {string} shopId 
   * @returns {Promise<Either<Failure, ShopProductEntity[]>>}
   */
  async getShopProducts(shopId) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
}