const router = require("express").Router();

const staffController = require("../controllers/staffController");

router.post("/create", staffController.addStaff);

// router.post("/login", staffController.login);

router.get("/", staffController.getStaff)

// router.get("/productcount", subCategorieController.getSubCategoriesProductCount);

// router.get("/:id", subCategorieController.getSubCategoryById);

// router.get("/sub/:category_id", subCategorieController.getSubCategoriesByCatId);

// router.put("/:id", subCategorieController.updateSubCategory);

// router.delete("/:id", subCategorieController.deleteSubCategory);

module.exports = router;
