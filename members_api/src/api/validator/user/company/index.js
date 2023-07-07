const CreateUserCompanyValidator = require('./create.validator');
const UpdateUserCompanyValidator = require('./update.validator');

const UserCompanyValidators = {
	CreateUserCompanyValidator,
	UpdateUserCompanyValidator,
};

module.exports = { UserCompanyValidators };
