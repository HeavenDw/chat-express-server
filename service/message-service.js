const MessageDto = require('../dtos/message-dto');
const MessageModel = require('../models/message-model');

class MessageService {
  async getMessages() {
    const messagesData = await MessageModel.find();
    const messages = messagesData.map((message) => new MessageDto(message));
    return messages;
  }
}

module.exports = new MessageService();
