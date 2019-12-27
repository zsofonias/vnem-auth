const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'User First name is required']
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'User Last name is required']
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'User Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'User Password is required'],
    minlength: [8, 'User Password must be atleast 8 Characters long'],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Password confirmation is required'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Inputed Passwords must match'
    }
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'viewer'],
    default: 'viewer'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  passwordChangedAt: Date
});

// hash user password upon creation
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// method to verify user password with the hashed db password
UserSchema.methods.verifyPassword = async function(
  inputedPassword,
  hashedPassword
) {
  return await bcrypt.compare(inputedPassword, hashedPassword);
};

UserSchema.methods.isPasswordChanged = function(jwtTokenTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTokenTimeStamp < changedTimeStamp;
  }
  return false;
};

module.exports = mongoose.model('User', UserSchema);
