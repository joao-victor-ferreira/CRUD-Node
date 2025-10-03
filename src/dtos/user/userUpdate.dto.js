export class UserUpdateDTO {
  constructor({ name, email, idade }) {
    if (name) this.name = name.trim();
    if (email) this.email = email.toLowerCase().trim();
    if (idade) this.idade = idade;
  }
}
