const Todo = require('../../model/user/todo.model');
const ErrorResponseBuilder = require('../../helper/error-response-builder.helper');

// @desc        Get user todos
// @route       GET /api/users/me/todos
// @access      Private
exports.getUserTodos = async (request, response) => {
	const todos = await Todo.find({ user: request.user });

	response.status(200).json({ success: true, todos: todos });
};

// @desc        Create user todo
// @route       POST /api/users/me/todos
// @access      Private
exports.createUserTodo = async (request, response) => {
	const todo = await Todo.create({ ...request.body, user: request.user._id });

	response.status(200).json({ success: true, todo: todo });
};

// @desc        Update user todo by ID
// @route       PUT /api/users/me/todos/:id
// @access      Private
exports.updateUserTodo = async (request, response, next) => {
	const request_todo = await Todo.findById(request.params.id);

	if (!request_todo) {
		return next(new ErrorResponseBuilder('Todo not found', 404));
	}

	if (String(request_todo.user) !== String(request.user._id)) {
		return next(new ErrorResponseBuilder('Permission error', 400));
	}

	const updated_todo = await Todo.findByIdAndUpdate(request.params.id, request.body, {
		new: true,
		runValidators: true,
	});

	response.status(200).json({ success: true, todo: updated_todo });
};

// @desc        Delete user todo by ID
// @route       DELETE /api/users/me/todos/:id
// @access      Private
exports.deleteUserTodo = async (request, response, next) => {
	const request_todo = await Todo.findById(request.params.id);

	if (!request_todo) {
		return next(new ErrorResponseBuilder('Todo not found', 404));
	}

	if (String(request_todo.user) !== String(request.user._id)) {
		return next(new ErrorResponseBuilder('Permission error', 400));
	}

	await Todo.findByIdAndDelete(request.params.id);

	response.status(200).json({ success: true });
};
