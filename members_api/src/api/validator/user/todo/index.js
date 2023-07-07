const CreateUserTodoValidator = require('./create.validator');
const UpdateUserTodoValidator = require('./update.validator');

const UserTodoValidators = {
	CreateUserTodoValidator,
	UpdateUserTodoValidator,
};

module.exports = { UserTodoValidators };
