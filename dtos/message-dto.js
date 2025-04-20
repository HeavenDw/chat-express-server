class MessageDto {
  body;
  id;
  user;
  createdAt;
  event;

  constructor(model) {
    this.body = model.body;
    this.id = model.id;
    this.user = model.user;
    this.createdAt = model.createdAt;
    this.event = model.event;
  }
}

module.exports = MessageDto;
