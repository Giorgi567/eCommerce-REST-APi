const CreateUserAddressValidator = require('./create.validator');
const UpdateUserAddressValidator = require('./update.validator');

const UserAddressValidators = {
	CreateUserAddressValidator,
	UpdateUserAddressValidator,
};

module.exports = { UserAddressValidators };
