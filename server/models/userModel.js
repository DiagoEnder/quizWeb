const crypto = require('crypto');
const mongoose = require('mongoose');

const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
        trim: true,
        maxlength: [40, 'User name must have less or equal then 40 charecters'],
        minlength: [5, 'User name must have more or equal then 10 characters'],
        
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'User email must be a valid email']
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['user','admin','lead-guide','guide'],
        default: 'user'
    }
    ,
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [8, 'User password must have more or equal then 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //this only works on create and  save!!!;
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.pre('save', async function(next) {
    
    //Only run this function if password was actually modefined
    if(!this.isModified('password')) return next();
    //hash password with cost 12
    this.password = await bcrypt.hash(this.password,12);
    //delete password confirm fields
    this.passwordConfirm = undefined;
    next();
})

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();
    
    this.passwordChangedAt = Date.now() - 1000;
    next();
})


userSchema.pre(/^find/, function (next) {
    // this point to the current query
    this.find({active: {$ne: false}});
    
    next();
    
    
})


userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000,10);
        console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}


userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    console.log({resetToken}, this.passwordResetToken)
        
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
}


const User = mongoose.model('User', userSchema);

module.exports = User;