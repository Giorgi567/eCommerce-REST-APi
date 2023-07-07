const { Router } = require("express");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/menu/category.controller");

const {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controller/menu/sub-category.controller");

const { jwtProtect } = require("../middleware/jwt-protect.middleware");
const { MongoIDValidator } = require("../validator/mongo-id.validator");
const { MenuItemsValidators } = require("../validator/menu");
const {
  authorizeRolesProtect,
} = require("../middleware/authorize-roles-protect.middleware");

const router = Router();

router
  .route("/categories")
  .get(getCategories)
  .post(
    jwtProtect,
    authorizeRolesProtect(["ADMIN"]),
    MenuItemsValidators.CreateCategoryValidator,
    createCategory
  );

router
  .route("/categories/:id")
  .get(MongoIDValidator, getCategory)
  .put(
    jwtProtect,
    authorizeRolesProtect(["ADMIN"]),
    MongoIDValidator,
    MenuItemsValidators.UpdateCategoryValidator,
    updateCategory
  )
  .delete(
    jwtProtect,
    authorizeRolesProtect(["ADMIN"]),
    MongoIDValidator,
    deleteCategory
  );

router
  .route("/sub_categories")
  .get(getSubCategories)
  .post(
    jwtProtect,
    authorizeRolesProtect(["ADMIN"]),
    MenuItemsValidators.CreateSubCategoryValidator,
    createSubCategory
  );

router
  .route("/sub_categories/:id")
  .get(MongoIDValidator, getSubCategory)
  .put(
    jwtProtect,
    authorizeRolesProtect(["ADMIN"]),
    MongoIDValidator,
    MenuItemsValidators.UpdateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    jwtProtect,
    authorizeRolesProtect(["ADMIN"]),
    MongoIDValidator,
    deleteSubCategory
  );

module.exports = router;
