import User from '../models/User.js';

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;
    const user = await User.findById(req.user.id);
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user preferences
// @route   PUT /api/user/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.preferences = { ...user.preferences, ...req.body };
    await user.save();
    
    res.status(200).json({
      success: true,
      preferences: user.preferences
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update currency
// @route   PUT /api/user/currency
// @access  Private
export const updateCurrency = async (req, res) => {
  try {
    const { currency } = req.body;
    const user = await User.findById(req.user.id);
    user.currency = currency;
    await user.save();
    
    res.status(200).json({
      success: true,
      currency: user.currency
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
