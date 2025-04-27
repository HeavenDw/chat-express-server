class UserOnlineDto {
  name;
  email;
  id;

  constructor(model) {
    this.name = model.name;
    this.email = model.email;
    this.id = model.id;
  }
}

module.exports = UserOnlineDto;
