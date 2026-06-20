import express from 'express';
import {
  getIncome,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
  getIncomeSummary
} from '../controllers/incomeController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getIncome)
  .post(protect, createIncome);

router.route('/summary')
  .get(protect, getIncomeSummary);

router.route('/:id')
  .get(protect, getIncomeById)
  .put(protect, updateIncome)
  .delete(protect, deleteIncome);

export default router;
