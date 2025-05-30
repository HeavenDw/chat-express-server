const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const UserOnlineDto = require('../dtos/user-online-dto');
const ApiError = require('../exceptions/api-error');
const UserOnlineModel = require('../models/user-online-model');

class UserService {
  async registration(name, email, password) {
    const userByName = await UserModel.findOne({ name });
    if (userByName) {
      throw ApiError.BadRequest(`User with name ${name} already exists`);
    }
    const userByEmail = await UserModel.findOne({ email });
    if (userByEmail) {
      throw ApiError.BadRequest(`User with email ${email} already exists`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const newUser = await UserModel.create({ name, email, password: hashPassword });
    const userDto = new UserDto(newUser);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest(`Incorrect activation link`);
    }
    user.isActivated = true;
    await user.save();
  }

  async login(name, password) {
    const user = await UserModel.findOne({ name });
    if (!user) {
      throw ApiError.BadRequest(`User with name ${name} not found`);
    }
    const isPassEqueals = await bcrypt.compare(password, user.password);
    if (!isPassEqueals) {
      throw ApiError.BadRequest(`Incorrect password`);
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const usersData = await UserModel.find();
    const users = usersData?.map((user) => new UserDto(user));
    return users;
  }

  async getUserById(userId) {
    const userData = await UserModel.findById(userId);
    return new UserDto(userData);
  }

  async getOnlineUsers() {
    const onlineUsers = await UserOnlineModel.find();
    const users = onlineUsers?.map((user) => new UserOnlineDto(user));
    return users;
  }

  async editUser(id, user) {
    const hashPassword = user?.password && (await bcrypt.hash(user.password, 3));
    const updatedUser = { ...user, password: hashPassword };
    const userData = await UserModel.findByIdAndUpdate(id, updatedUser, { new: true });
    return new UserDto(userData);
  }
}

module.exports = new UserService();
