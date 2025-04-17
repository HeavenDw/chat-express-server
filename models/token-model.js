const { Schema, model } = require('mongoose');

const TokenSchems = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
});

module.exports = model('Token', TokenSchems);
