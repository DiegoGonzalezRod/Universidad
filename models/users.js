
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: String,
        code: Number,
        intentos: Number,
        estado: Boolean,
        email: {
            type: String,
            uinique: true
        },
        password: String,
        role: {
            type: ['user', 'admin'],
            default: 'user'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('users', userSchema);