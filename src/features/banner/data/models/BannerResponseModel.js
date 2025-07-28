class BannerModel {
  constructor({ id, name, photo, description, status }) {
    this.id = id;
    this.name = name;
    this.photo = photo;
    this.description = description;
    this.status = status;
  }

  static fromJSON(json) {
    return new BannerModel({
      id: json.id,
      name: json.name,
      photo: json.photo,
      description: json.description,
      status: json.status,
    });
  }
}

class PaginationModel {
  constructor({ current_page, per_page, total_data, total_pages }) {
    this.currentPage = current_page;
    this.perPage = per_page;
    this.totalData = total_data;
    this.totalPages = total_pages;
  }

  static fromJSON(json) {
    return new PaginationModel(json);
  }
}

export class BannerResponseModel {
  constructor({ banners, pagination }) {
    this.banners = banners;
    this.pagination = pagination;
  }
  
  static fromJSON(json) {
    const banners = json.data.map(bannerJson => BannerModel.fromJSON(bannerJson));
    const pagination = PaginationModel.fromJSON(json.pagination);
    return new BannerResponseModel({ banners, pagination });
  }
}