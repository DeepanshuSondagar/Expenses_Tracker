import Expense from '../models/Expense.js';

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json({ success: true, count: expenses.length, expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense || expense.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense || expense.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense || expense.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    await expense.deleteOne();
    res.status(200).json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expense summary
// @route   GET /api/expenses/summary
// @access  Private
export const getExpenseSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
    res.status(200).json({ success: true, total, byCategory, count: expenses.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
