import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const budgets = await Budget.find({ user: req.user.id, month: currentMonth });
    
    // Calculate spent amounts for each budget
    const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
      const expenses = await Expense.find({
        user: req.user.id,
        category: budget.category,
        date: {
          $gte: new Date(currentMonth + '-01'),
          $lt: new Date(currentMonth + '-31')
        }
      });
      
      const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      return {
        ...budget.toObject(),
        spent
      };
    }));

    res.status(200).json({ success: true, budgets: budgetsWithSpent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;
    const currentMonth = new Date().toISOString().slice(0, 7);

    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category,
      month: currentMonth
    });

    if (existingBudget) {
      return res.status(400).json({ message: 'Budget already exists for this category this month' });
    }

    const budget = await Budget.create({
      user: req.user.id,
      category,
      amount,
      month: currentMonth
    });

    res.status(201).json({ success: true, budget: { ...budget.toObject(), spent: 0 } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);
    
    if (!budget || budget.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    const expenses = await Expense.find({
      user: req.user.id,
      category: budget.category,
      date: {
        $gte: new Date(budget.month + '-01'),
        $lt: new Date(budget.month + '-31')
      }
    });
    
    const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.status(200).json({ success: true, budget: { ...budget.toObject(), spent } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget || budget.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await budget.deleteOne();
    res.status(200).json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
