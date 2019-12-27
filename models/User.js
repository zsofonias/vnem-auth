const mongoose = require('mongoose');

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
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('User', UserSchema);
