const Expenses = require('../models/expenses.model');

exports.addExpense = async (req, res) => {
  try {
    const newExpense = await Expenses.create(req.body);
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const allExpenses = await Expenses.findAll();
    res.status(200).json(allExpenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExpensesById = async (req, res) => {
  const expensesId = req.params.id;

  try {
    const expenses = await Expenses.findByPk(expensesId);
    if (!expenses) {
      res.status(404).send('Expenses record not found');
    } else {
      res.status(200).json(expenses);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  const expenseId = req.params.id;
  // const newData = req.body; // Assuming the request body contains the updated data
  console.log(req.body)
  try {
    const expense = await Expenses.findByPk(expenseId);
    if (!expense) {
      res.status(404).send('Expense record not found');
    } else {
      await expense.update(req.body.values);
      res.status(200).json(expense);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;

  try {
    const expense = await Expenses.findByPk(expenseId);
    if (!expense) {
      res.status(404).send('Expense record not found');
    } else {
      await expense.destroy();
      res.status(200).json({ message: 'Expense record deleted successfully.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
