class UserDto {
  name;
  email;
  id;

  constructor(model) {
    this.name = model.name;
    this.email = model.email;
    this.id = model._id;
  }
}

module.exports = UserDto;
