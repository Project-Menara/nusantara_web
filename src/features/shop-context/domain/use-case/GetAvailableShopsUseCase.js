export class GetAvailableShopsUseCase {
  constructor(shopContextRepository) {
    this.repository = shopContextRepository;
  }

  /**
   * Mengambil daftar nama toko yang ditugaskan ke kasir.
   */
  async execute() {
    return await this.repository.getAvailableShops();
  }
}