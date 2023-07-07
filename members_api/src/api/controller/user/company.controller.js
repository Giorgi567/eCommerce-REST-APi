const Company = require("../../model/user/company.model");
const ErrorResponseBuilder = require("../../helper/error-response-builder.helper");

// @desc        Get user companies
// @route       GET /api/users/me/companies
// @access      Private
exports.getUserCompanies = async (request, response) => {
  const user_companies = await Company.find({ user: request.user._id });

  response.status(200).json({ success: true, companies: user_companies });
};

// @desc        Create user company
// @route       POST /api/users/me/companies
// @access      Private
exports.createUserCompany = async (request, response) => {
  const new_company = await Company.create({
    ...request.body,
    user: request.user._id,
  });

  response.status(200).json({ success: true, company: new_company });
};

// @desc        Update user company by ID
// @route       PUT /api/users/me/companies/:id
// @access      Private
exports.updateUserCompany = async (request, response, next) => {
  const request_company = await Company.findById(request.params.id);

  if (!request_company) {
    return next(new ErrorResponseBuilder("Company not found", 404));
  }

  if (String(request_company.user) !== String(request.user._id)) {
    return next(new ErrorResponseBuilder("Permission error", 400));
  }

  const updated_company = await Company.findByIdAndUpdate(
    request_company._id,
    request.body,
    {
      new: true,
      runValidators: true,
    }
  );

  response.status(200).json({ success: true, company: updated_company });
};

// @desc        Delete user company by ID
// @route       DELETE /api/users/me/companies/:id
// @access      Private
exports.deleteUserCompany = async (request, response, next) => {
  const request_company = await Company.findById(request.params.id);

  if (!request_company) {
    return next(new ErrorResponseBuilder("Company not found", 404));
  }

  if (String(request_company.user) !== String(request.user._id)) {
    return next(new ErrorResponseBuilder("Permission error", 400));
  }

  await Company.findByIdAndDelete(request_company._id);

  response.status(200).json({ success: true });
};
