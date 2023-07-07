const { Router } = require('express');
const { registration, login, forgotPassword, resetPassword } = require('../controller/auth/auth.controller');
const { LoginValidator } = require('../validator/auth');
const {
	CreateUserValidator,
	UserRoleValidator,
	ResetUserPasswordValidator,
	ForgotUserPasswordValidator,
} = require('../validator/user');

const router = Router();

router.route('/registration').post(CreateUserValidator, UserRoleValidator, registration);

router.route('/login').post(LoginValidator, login);

router.route('/forgot_password').put(ForgotUserPasswordValidator, forgotPassword);
router.route('/reset_password/:reset_token').put(ResetUserPasswordValidator, resetPassword);

module.exports = router;
