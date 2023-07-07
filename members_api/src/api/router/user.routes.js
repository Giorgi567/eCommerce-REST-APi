const { Router } = require('express');

const { getUserPosts } = require('../controller/post/post.controller');
const { getUserAlbums } = require('../controller/album/album.controller');

const {
	createUserAddress,
	getUserAddresses,
	updateUserAddress,
	deleteUserAddress,
} = require('../controller/user/address.controller');

const {
	getUserCompanies,
	createUserCompany,
	updateUserCompany,
	deleteUserCompany,
} = require('../controller/user/company.controller');

const { getUserTodos, createUserTodo, updateUserTodo, deleteUserTodo } = require('../controller/user/todo.controller');
const {
	create,
	deleteOne,
	getAll,
	getOne,
	updateOne,
	getMe,
	updateMe,
	changePassword,
	changeProfileImage,
	deleteProfileImage,
} = require('../controller/user/user.controller');

const { authorizeRolesProtect } = require('../middleware/authorize-roles-protect.middleware');
const { jwtProtect } = require('../middleware/jwt-protect.middleware');

const {
	CreateUserValidator,
	AdminUserRoleValidator,
	UpdateUserValidator,
	UpdateMeValidator,
	ChangeUserPasswordValidator,
	ChangeUserProfileImageValidator,
} = require('../validator/user');

const { UserAddressValidators } = require('../validator/user/address');
const { UserCompanyValidators } = require('../validator/user/company');
const { UserTodoValidators } = require('../validator/user/todo');
const { MongoIDValidator } = require('../validator/mongo-id.validator');
const {
	getUserCart,
	addItemInUserCart,
	removeItemFromUserCart,
	clearUserCart,
} = require('../controller/user/cart.controller');
const { AddItemInUserCartValidator } = require('../validator/user/cart/add-item.validator');
const {
	getUserFavorites,
	addProductInUserFavoriteProducts,
	removeProductFromUserFavoriteProducts,
	clearUserFavoriteProducts,
} = require('../controller/user/favorites.controller');
const { getUserOrders } = require('../controller/order.controller');

const router = Router();

router
	.route('/')
	.get(jwtProtect, authorizeRolesProtect(['ADMIN']), getAll)
	.post(jwtProtect, authorizeRolesProtect(['ADMIN']), CreateUserValidator, AdminUserRoleValidator, create);

router.route('/me').get(jwtProtect, getMe).put(jwtProtect, UpdateMeValidator, updateMe);

router.route('/me/change_password').put(jwtProtect, ChangeUserPasswordValidator, UpdateMeValidator, changePassword);

router
	.route('/me/profile_image')
	.put(jwtProtect, ChangeUserProfileImageValidator, changeProfileImage)
	.delete(jwtProtect, deleteProfileImage);

router
	.route('/me/addresses')
	.get(jwtProtect, getUserAddresses)
	.post(jwtProtect, UserAddressValidators.CreateUserAddressValidator, createUserAddress);

router
	.route('/me/addresses/:id')
	.put(jwtProtect, MongoIDValidator, UserAddressValidators.UpdateUserAddressValidator, updateUserAddress)
	.delete(jwtProtect, MongoIDValidator, deleteUserAddress);

router
	.route('/me/companies')
	.get(jwtProtect, getUserCompanies)
	.post(jwtProtect, UserCompanyValidators.CreateUserCompanyValidator, createUserCompany);

router
	.route('/me/companies/:id')
	.put(jwtProtect, MongoIDValidator, UserCompanyValidators.UpdateUserCompanyValidator, updateUserCompany)
	.delete(jwtProtect, MongoIDValidator, deleteUserCompany);

router
	.route('/me/todos')
	.get(jwtProtect, getUserTodos)
	.post(jwtProtect, UserTodoValidators.CreateUserTodoValidator, createUserTodo);

router
	.route('/me/todos/:id')
	.put(jwtProtect, MongoIDValidator, UserTodoValidators.UpdateUserTodoValidator, updateUserTodo)
	.delete(jwtProtect, MongoIDValidator, deleteUserTodo);

router.route('/me/cart').get(jwtProtect, getUserCart);

router
	.route('/me/cart/:id')
	.post(jwtProtect, AddItemInUserCartValidator, addItemInUserCart)
	.delete(jwtProtect, MongoIDValidator, removeItemFromUserCart);

router.route('/me/cart/clear').put(jwtProtect, clearUserCart);

router.route('/me/favorites').get(jwtProtect, getUserFavorites);

router
	.route('/me/favorites/products/:id')
	.post(jwtProtect, MongoIDValidator, addProductInUserFavoriteProducts)
	.delete(jwtProtect, MongoIDValidator, removeProductFromUserFavoriteProducts);

router.route('/me/favorites/products/clear').put(jwtProtect, clearUserFavoriteProducts);

router.route('/me/posts').get(jwtProtect, getUserPosts);

router.route('/me/albums').get(jwtProtect, getUserAlbums);

router.route('/me/orders').get(jwtProtect, getUserOrders);

router
	.route('/:id')
	.get(jwtProtect, authorizeRolesProtect(['ADMIN']), MongoIDValidator, getOne)
	.put(jwtProtect, authorizeRolesProtect(['ADMIN']), MongoIDValidator, UpdateUserValidator, updateOne)
	.delete(jwtProtect, authorizeRolesProtect(['ADMIN']), MongoIDValidator, deleteOne);

module.exports = router;
