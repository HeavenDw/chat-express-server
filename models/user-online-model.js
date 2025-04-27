const { Schema, model } = require('mongoose');

const UserOnlineSchema = new Schema({
  id: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
});

module.exports = model('UserOnline', UserOnlineSchema);
