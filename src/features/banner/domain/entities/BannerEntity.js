export class BannerEntity {
  constructor({ id, name, photo, description, isActive }) {
    this.id = id;
    this.name = name;
    this.photo = photo;
    this.description = description;
    this.isActive = isActive; // Ubah status 0/1 menjadi boolean
  }
}
