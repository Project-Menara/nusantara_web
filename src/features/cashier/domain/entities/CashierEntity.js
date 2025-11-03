// Mendefinisikan struktur data bersih untuk Kasir yang akan digunakan di seluruh aplikasi.
// cashierEntity.js
export class CashierEntity {
  constructor({
    id,
    name,
    username,
    email,
    photo,
    isActive,
    role,
    createdAt,
  }) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.photo = photo;
    this.isActive = isActive; // Mengubah status 0/1 menjadi boolean
    this.role = role;
    this.createdAt = new Date(createdAt);
  }

  // "Pabrik" untuk membuat entitas dari data JSON mentah
  static fromJSON(json) {
    return new CashierEntity({
      id: json.id,
      name: json.name,
      username: json.username,
      email: json.email,
      photo: json.photo || null,
      isActive: json.status === 1,
      role: json.role,
      createdAt: json.created_at,
    });
  }
}
