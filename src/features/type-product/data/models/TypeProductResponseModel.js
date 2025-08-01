import { PaginationEntity } from "../../domain/entities/PaginationEntity";
export class TypeProductModel {
  constructor({ id, name, image, status }) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.status = status;
  }

  static fromJSON(json) {
    return new TypeProductModel(json);
  }
}

export class TypeProductResponseModel {
  constructor({ typeProducts, pagination }) {
    this.typeProducts = typeProducts;
    this.pagination = pagination;
  }

  static fromJSON(json) {
    const typeProducts = json.data.map((tpJson) =>
      TypeProductModel.fromJSON(tpJson)
    );
    const pagination = new PaginationEntity(json.pagination);
    return new TypeProductResponseModel({ typeProducts, pagination });
  }
}
