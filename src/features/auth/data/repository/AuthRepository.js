// AuthRepository.js
import { IAuthRepository } from "../../domain/repository/IAuthRepository";
import { UserEntity } from "../../domain/entities/UserEntity";
import {
  LoginResponseModel,
  ProfileUserModel,
} from "../models/AuthResponseModel.js";
import { AuthRemoteSource } from "../source/AuthRemoteSource";

export class AuthRepository extends IAuthRepository {
  constructor() {
    super();
    this.remoteSource = new AuthRemoteSource();
  }

  async login(email, password) {
    const loginApiResponse = await this.remoteSource.login(email, password);
    const loginModel = LoginResponseModel.fromJSON(loginApiResponse);
    const token = loginModel.token;

    if (!token) {
      throw new Error("Login gagal: Token tidak diterima.");
    }

    localStorage.setItem("auth_token", token);

    const profileApiResponse = await this.remoteSource.getProfile(token);
    const profileModel = ProfileUserModel.fromJSON(profileApiResponse.data);

    const userEntity = new UserEntity({
      id: profileModel.id,
      name: profileModel.name,
      email: profileModel.email,
      role: profileModel.roleName,
    });

    return { token, user: userEntity };
  }

  async getProfile(token) {
    const profileApiResponse = await this.remoteSource.getProfile();
    const profileModel = ProfileUserModel.fromJSON(profileApiResponse.data);

    return new UserEntity({
      id: profileModel.id,
      name: profileModel.name,
      email: profileModel.email,
      role: profileModel.roleName,
    });
  }

  async logout() {
    // Panggil API untuk memberitahu server agar menghapus sesi/token
    await this.remoteSource.logout();
    // Hapus token dari penyimpanan lokal
    localStorage.removeItem("auth_token");
  }
}
