const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { tokenTypes } = require('../config/tokens');
const { data } = require('../config/logger');

const register = catchAsync(async (req, res) => {
  const stringifiedBody = convertObjectValuesToString(req.body);
  console.log(stringifiedBody);
  const user = await userService.createUser(stringifiedBody);
  const tokens = await tokenService.generateAuthTokens(user);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  res.status(httpStatus.OK).send({
    code: httpStatus.CREATED,
    message: 'Tạo tài khoản thành công. Vui lòng kiểm tra email để xác thực tài khoản',
  });
  // res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password, deviceToken } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password, deviceToken);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Đăng nhập thành công',
    data: {
      user: user,
      tokens: tokens,
    },
  });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken, req.body.deviceToken);
  res.status(httpStatus.NO_CONTENT).send({
    code: httpStatus.NO_CONTENT,
    message: 'Đăng xuất thành công',
  });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Refresh token thành công',
    data: {
      tokens: tokens,
    },
  });
});

function generateRandomPassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

const forgotPassword = catchAsync(async (req, res) => {
  const resetPassword = generateRandomPassword(8);
  // const resetPassword = await tokenService.generateResetPasswordToken(req.body.email);
  await userService.updateUserByEmail(req.body.email, { password: resetPassword });
  await emailService.sendResetPasswordEmail(req.body.email, resetPassword);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Mật khẩu mới đã được gửi qua email',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  // const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  const infoToken = await tokenService.verifyToken(req.headers.authorization.split(' ')[1], tokenTypes.ACCESS);
  await authService.resetPassword(infoToken.sub, req.body.currentPassword, req.body.newPassword);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, message: 'Đổi mật khẩu thành công' });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

function convertObjectValuesToString(obj) {
  const newObj = {};
  for (const key in obj) {
    if (typeof obj[key] != 'string') {
      newObj[key] = obj[key].toString();
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
