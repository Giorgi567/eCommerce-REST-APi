const ErrorResponseBuilder = require('../helper/error-response-builder.helper');

const authorizeRolesProtect = (roles) => {
	return (request, response, next) => {
		if (!roles.includes(request.user.role)) {
			return next(
				new ErrorResponseBuilder(`User role ${request.user.role} is not authorized access this route`, 401)
			);
		}

		next();
	};
};

module.exports = { authorizeRolesProtect };
