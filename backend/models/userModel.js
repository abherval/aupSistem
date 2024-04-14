const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.set('strictQuery', true);
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    email: { 
        type: String,
        required: true
    },
    
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    creatAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User; 
