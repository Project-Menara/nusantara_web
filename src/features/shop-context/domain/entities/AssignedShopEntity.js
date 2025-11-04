export class AssignedShopEntity {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  static fromJSON(json) {
    return new AssignedShopEntity({
      id: json.id,
      name: json.name,
    });
  }
}