// src/repositories/userRepository.js
import User from "../models/User.js";

class UserRepository {
  async create(data) {
    return await User.create(data);
  }

  async findAll() {
    return await User.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async update(id, updates) {
    return await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      overwrite: false,
    });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
}

export default new UserRepository();
