require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');
const PORT = process.env.PORT || 5000;
const app = express();
const MessageModel = require('./models/message-model');
const UserOnlineModel = require('./models/user-online-model');
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);

app.ws('/', (ws) => {
  ws.on('message', async (message) => {
    const parsedMessage = JSON.parse(message);
    switch (parsedMessage.event) {
      case 'connect': {
        const userOnline = await UserOnlineModel.findOne({ email: parsedMessage.user.email });
        if (!userOnline) {
          UserOnlineModel.create(parsedMessage.user);
        }
        break;
      }
      case 'disconnect': {
        await UserOnlineModel.findOneAndDelete({
          email: parsedMessage.user.email,
        });
        break;
      }
      case 'message': {
        MessageModel.create(parsedMessage);
        break;
      }
    }
    broadcastMessage(parsedMessage);
  });
});

const broadcastMessage = (message) => {
  aWss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
};

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    await UserOnlineModel.deleteMany({});
  } catch (e) {
    console.log(e);
  }
};

start();
