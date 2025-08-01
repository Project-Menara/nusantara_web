export class PaginationEntity {
  constructor({ currentPage, perPage, totalData, totalPages }) {
    this.currentPage = currentPage;
    this.perPage = perPage;
    this.totalData = totalData;
    this.totalPages = totalPages;
  }
}
