// Model untuk response /login
export class LoginResponseModel {
  constructor({ statusCode, message, token }) {
    this.statusCode = statusCode;
    this.message = message;
    this.token = token;
  }

  static fromJSON(json) {
    return new LoginResponseModel({
      statusCode: json.status_code,
      message: json.message,
      token: json.data,
    });
  }
}

// Model untuk nested object 'data' dari API /auth/me
export class ProfileUserModel {
  constructor({ id, name, email, role }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.roleName = role.Name;
  }

  static fromJSON(json) {
    return new ProfileUserModel({
      id: json.id,
      name: json.name,
      email: json.email,
      role: json.role,
    });
  }
}