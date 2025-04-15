const {mongoose,Schema} = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String,
        
    },
    password:{
        type: String,
        required: true
    },
    profileImageURL:{
        type: String,
        required: true,
        default: "/images/default.png"
    },
    role:{
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
},{timestamps: true});


userSchema.pre('save', async function (next) {
    const user = this;

     // Only hash the password if it's modified or is a new user
     if (user.isModified('password')) {
        try {
            // Generate salt and hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.salt = salt; // Store the salt in the database if needed
            user.password = hashedPassword;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        throw err;
    }
};

module.exports = mongoose.model('user', userSchema);