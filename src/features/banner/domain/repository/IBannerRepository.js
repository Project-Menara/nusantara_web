export class IBannerRepository {
  async getBanners(page = 1, search = "") {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async createBanner(formData) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async getBannerById(id) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async updateBanner(id, formData) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async updateBannerStatus(id, status) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async deleteBanner(id) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
}
