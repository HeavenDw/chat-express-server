class UserOnlineDto {
  email;
  id;

  constructor(model) {
    this.email = model.email;
    this.id = model.id;
  }
}

module.exports = UserOnlineDto;
