export class UserResponseDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.idade = user.idade;
    this.createdAt = user.createdAt;
  }
}
