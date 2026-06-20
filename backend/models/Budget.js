import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a budget amount'],
    min: 0
  },
  month: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
