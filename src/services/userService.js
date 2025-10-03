import UserRepository from "../repositories/userRepository.js";
import { UserCreateDTO } from "../dtos/user/userCreate.dto.js";
import { UserUpdateDTO } from "../dtos/user/userUpdate.dto.js";
import { UserResponseDTO } from "../dtos/user/userResponse.dto.js";

class UserService {
  async createUser(data) {
    const userDTO = new UserCreateDTO(data);
    const user = await UserRepository.create(userDTO);
    return new UserResponseDTO(user);
  }

  async getUsers() {
    const users = await UserRepository.findAll();
    return users.map((u) => new UserResponseDTO(u));
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    return user ? new UserResponseDTO(user) : null;
  }

  async updateUser(id, data) {
    const updateDTO = new UserUpdateDTO(data);
    const user = await UserRepository.update(id, updateDTO);
    return user ? new UserResponseDTO(user) : null;
  }

  async deleteUser(id) {
    return await UserRepository.delete(id);
  }
}

export default new UserService();
