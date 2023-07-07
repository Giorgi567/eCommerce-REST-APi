const Address = require('../../model/user/address.model');
const ErrorResponseBuilder = require('../../helper/error-response-builder.helper');

// @desc        Get user addresses
// @route       GET /api/users/me/addresses
// @access      Private
exports.getUserAddresses = async (request, response) => {
	const user_addresses = await Address.find({ user: request.user._id });

	response.status(200).json({ success: true, addresses: user_addresses });
};

// @desc        Create user address
// @route       POST /api/users/me/addresses
// @access      Private
exports.createUserAddress = async (request, response) => {
	const new_address = await Address.create({ ...request.body, user: request.user._id });

	response.status(200).json({ success: true, address: new_address });
};

// @desc        Update user address by ID
// @route       PUT /api/users/me/addresses/:id
// @access      Private
exports.updateUserAddress = async (request, response, next) => {
	const request_address = await Address.findById(request.params.id);

	if (!request_address) {
		return next(new ErrorResponseBuilder('Address not found', 404));
	}

	if (String(request_address.user) !== String(request.user._id)) {
		return next(new ErrorResponseBuilder('Permission error', 400));
	}

	const updated_address = await Address.findByIdAndUpdate(request_address._id, request.body, {
		new: true,
		runValidators: true,
	});

	response.status(200).json({ success: true, address: updated_address });
};

// @desc        Delete user address by ID
// @route       DELETE /api/users/me/addresses/:id
// @access      Private
exports.deleteUserAddress = async (request, response, next) => {
	const request_address = await Address.findById(request.params.id);

	if (!request_address) {
		return next(new ErrorResponseBuilder('Address not found', 404));
	}

	if (String(request_address.user) !== String(request.user._id)) {
		return next(new ErrorResponseBuilder('Permission error', 400));
	}

	await Address.findByIdAndDelete(request_address._id);

	response.status(200).json({ success: true });
};
