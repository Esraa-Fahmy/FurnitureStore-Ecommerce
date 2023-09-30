const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },
    slug: {
      type: String,
      
    },
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
    },
    phone: String,
    profileImg: String,

    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Too short password'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();
   // Hashing user password
   this.password = await bcrypt.hash(this.password, 12);
   next();
 });
 

const User = mongoose.model('User', userSchema);

module.exports = User;
