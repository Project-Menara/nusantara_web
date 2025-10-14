// domain/repository/IEventRepository.js
export class IEventRepository {
  /**
   * @param {Object} params - Parameter query (pagination, filter, etc.)
   * @returns {Promise<Either<Failure, {data: EventEntity[], pagination: Object}>>}
   */
  async getEvents(params) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} id - ID Event
   * @returns {Promise<Either<Failure, EventEntity>>}
   */
  async getEventById(id) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {FormData} data - Data Event yang akan dibuat
   * @returns {Promise<Either<Failure, EventEntity>>}
   */
  async createEvent(data) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} id - ID Event
   * @param {FormData} data - Data Event yang akan diupdate
   * @returns {Promise<Either<Failure, EventEntity>>}
   */
  async updateEvent(id, data) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} id - ID Event
   * @param {number} status - Status baru (0 atau 1)
   * @returns {Promise<Either<Failure, string>>}
   */
  async updateEventStatus(id, status) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} id - ID Event
   * @returns {Promise<Either<Failure, string>>}
   */
  async deleteEvent(id) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
}