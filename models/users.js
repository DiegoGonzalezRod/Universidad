const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: String,
    code: Number,
    intentos: Number,

   
    status: {
      type: String,
      enum: ['pending', 'validated'],
      default: 'pending'
    },

    email: {
      type: String,
      unique: true, 
      required: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['user', 'admin'], 
      default: 'user'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('users', userSchema);
