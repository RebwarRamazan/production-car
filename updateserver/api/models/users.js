const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,    },
    password: { type: String, required: true },
    userRole: { type: String, default: 'Reseller' },
    TotalBals: { type: Number, default: 0 },
    token : String
});

module.exports = mongoose.model('User', userSchema);