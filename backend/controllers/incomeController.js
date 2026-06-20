import Income from '../models/Income.js';

// @desc    Get all income
// @route   GET /api/income
// @access  Private
export const getIncome = async (req, res) => {
  try {
    const income = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json({ success: true, count: income.length, income });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single income
// @route   GET /api/income/:id
// @access  Private
export const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income || income.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Income not found' });
    }
    res.status(200).json({ success: true, income });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new income
// @route   POST /api/income
// @access  Private
export const createIncome = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const income = await Income.create(req.body);
    res.status(201).json({ success: true, income });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update income
// @route   PUT /api/income/:id
// @access  Private
export const updateIncome = async (req, res) => {
  try {
    let income = await Income.findById(req.params.id);
    if (!income || income.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Income not found' });
    }
    income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, income });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income || income.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Income not found' });
    }
    await income.deleteOne();
    res.status(200).json({ success: true, message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get income summary
// @route   GET /api/income/summary
// @access  Private
export const getIncomeSummary = async (req, res) => {
  try {
    const income = await Income.find({ user: req.user.id });
    const total = income.reduce((sum, inc) => sum + inc.amount, 0);
    const byCategory = income.reduce((acc, inc) => {
      acc[inc.category] = (acc[inc.category] || 0) + inc.amount;
      return acc;
    }, {});
    res.status(200).json({ success: true, total, byCategory, count: income.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
