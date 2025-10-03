export class UserCreateDTO {
  constructor({ name, email, idade }) {
    this.name = name?.trim();
    this.email = email?.toLowerCase().trim();
    this.idade = idade;
  }
}
