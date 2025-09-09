// Kontrak atau "Blueprint" yang mendefinisikan semua metode yang harus dimiliki oleh repository kasir.
export class ICashierRepository {
  async getCashiers(page = 1, search = "") {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async createCashier(data) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async getCashierById(id) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async updateCashier(id, data) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async deleteCashier(id) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
  async updateCashierStatus(id, status) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
}
