// 📦features/auth/domain/entities/UserEntity.js
export class UserEntity {
  constructor({ id, name, email, role }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}