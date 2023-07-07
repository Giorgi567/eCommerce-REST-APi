const CreateUserValidator = require('./create-user.validator');
const UserRoleValidator = require('./user-role.validator');
const AdminUserRoleValidator = require('./admin-user-role.validator');
const UpdateUserValidator = require('./update-user.validator');
const UpdateMeValidator = require('./update-me.validator');
const ChangeUserPasswordValidator = require('./change-password.validator');
const ResetUserPasswordValidator = require('./reset-password.validator');
const ForgotUserPasswordValidator = require('./forgot-password.validator');
const ChangeUserProfileImageValidator = require('./change-profile-image.validator');

module.exports = {
	CreateUserValidator,
	UpdateUserValidator,
	UserRoleValidator,
	AdminUserRoleValidator,
	UpdateMeValidator,
	ChangeUserPasswordValidator,
	ResetUserPasswordValidator,
	ForgotUserPasswordValidator,
	ChangeUserProfileImageValidator,
};
