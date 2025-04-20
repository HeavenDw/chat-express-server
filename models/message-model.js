const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  user: {
    id: { type: String, required: true },
    email: { type: String, required: true },
  },
  body: {
    type: String,
    required: true,
  },
  event: { type: String, required: true },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
