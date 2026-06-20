import express from 'express';
import {
  updateProfile,
  updatePreferences,
  updateCurrency
} from '../controllers/userController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.put('/preferences', protect, updatePreferences);
router.put('/currency', protect, updateCurrency);

export default router;
