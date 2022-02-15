const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    serviceNumber: {
        type: String,
        required: [true, 'Service number cannot be blank']
    },
    rank: {
        type: String,
        required: [true, 'You must choose a rank']
    },
    firstName: {
        type: String,
        required: [true, 'First name cannot be blank']
    },
    lastName: {
        type: String,
        required: [true, 'Last name cannot be blank']
    },
    unit: {
        type: String,
        required: [true, 'unit cannot be blank']
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number cannot be blank']
    },
    emailAddress: {
        type: String,
        required: [true, 'Email address cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    }
});

userSchema.statics.findAndValidate = async function(username, password) {
    const foundUser = await this.findOne({ username });
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid? foundUser : false;
}

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('User', userSchema);