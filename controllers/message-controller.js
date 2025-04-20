const messageService = require('../service/message-service');

class MessageController {
  async getMessages(req, res, next) {
    try {
      const messages = await messageService.getMessages();
      return res.json(messages);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new MessageController();
