const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        //npm validator package
        throw new Error('Enter valid email');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      //custom validate
      if (value < 0) throw new Error('Age must be positive number');
    },
  },
  password: {
    type: String,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.includes('password')) {
        throw new Error('password shouldnt contain password');
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//to send response without password and token array
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString() },
    'thisismynewcourse'
  );
  console.log(token);
  user.tokens = user.tokens.concat({ token });
  console.log(user.tokens);
  await user.save();

  return token;
};
//calling method on model so static is used
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to login');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }
  return user;
};
//to hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  console.log(user);
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
