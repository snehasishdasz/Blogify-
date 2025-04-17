const jwt = require("jsonwebtoken");


const generateToken = (user)=>{
    return jwt.sign({
        email:user.email,
        fullName: user.fullName,
        userId:user._id,
        profileImageURL:user.profileImageURL,
        role:user.role,
    },process.env.SECRET)
};

const verifyToken = (token)=>{
    return jwt.verify(token,process.env.SECRET)
};

module.exports = {
    generateToken,
    verifyToken
}