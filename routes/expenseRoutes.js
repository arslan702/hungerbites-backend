const router = require("express").Router();

const expensesController = require("../controllers/expensesController");

router.post("/", expensesController.addExpense)

router.get("/", expensesController.getAllExpenses)

router.get("/:id", expensesController.getExpensesById)

router.put("/:id", expensesController.updateExpense)

router.delete("/:id", expensesController.deleteExpense)

module.exports = router;