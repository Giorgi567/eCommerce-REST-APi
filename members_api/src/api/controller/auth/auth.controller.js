const User = require("../../model/user/user.model");
const UserFavorite = require("../../model/user/favorites.model");
const UserCart = require("../../model/user/cart.model");
const ErrorResponseBuilder = require("../../helper/error-response-builder.helper");
const crypto = require("crypto");
const { sendEmail } = require("../../util/send-email.util");

// @desc        Registration
// @route       POST /api/auth/registration
// @access      Public
exports.registration = (request, response, next) => {
  User.create(request.body)
    .then(async (new_user) => {
      const access_token = new_user.getJwt();

      await UserFavorite.create({ user: new_user._id });
      await UserCart.create({ user: new_user._id });

      response.status(201).json({ success: true, access_token: access_token });
    })
    .catch((error) => {
      return next(new ErrorResponseBuilder(error.message, 500));
    });
};

// @desc        Login
// @route       POST /api/auth/login
// @access      Public
exports.login = async (request, response, next) => {
  try {
    const user = await User.findOne({ email: request.body.email });

    if (!user) {
      return next(
        new ErrorResponseBuilder(
          `The user could not be found with the specified email: ${request.body.email}`,
          404
        )
      );
    }

    const is_match = await user.matchPassword(request.body.password);

    if (!is_match) {
      return next(new ErrorResponseBuilder("Please enter valid password", 400));
    }

    const access_token = user.getJwt();

    response.status(200).json({ success: true, access_token: access_token });
  } catch (error) {
    return next(new ErrorResponseBuilder(error.message, 500));
  }
};

// @desc        Forgot Password
// @route       PUT /api/auth/forgot_password
// @access      Public
exports.forgotPassword = async (request, response, next) => {
  const user = await User.findOne({ email: request.body.email });

  if (!user) {
    return next(
      new ErrorResponseBuilder(
        `The user could not be found with the specified email: ${request.body.email}`,
        404
      )
    );
  }

  const reset_token = user.getResetPasswordToken();

  await user.save();

  await sendEmail({
    email: request.body.email,
    subject: `${process.env.APP_NAME}: პაროლის აღდგენა`,
    message: `გიგზავნით პაროლის აღდგენის მისამართს: https://members_api.com/reset_password/${reset_token}`,
  });

  response.status(200).json({ success: true, reset_token: reset_token });
};

// @desc        Reset Password
// @route       PUT /api/auth/reset_password/:reset_token
// @access      Public
exports.resetPassword = async (request, response, next) => {
  const reset_password_token = crypto
    .createHash("sha256")
    .update(request.params.reset_token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: reset_password_token,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponseBuilder(`Invalid reset token`, 400));
  }

  user.password = request.body.newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;

  await user.save();

  response.status(200).json({ success: true });
};
