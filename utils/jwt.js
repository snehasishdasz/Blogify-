const jwt = require("jsonwebtoken");

const SECRET = "BaTM@n@756";

const generateToken = (user)=>{
    return jwt.sign({
        email:user.email,
        fullName: user.fullName,
        userId:user._id,
        profileImageURL:user.profileImageURL,
        role:user.role,
    },SECRET)
};

const verifyToken = (token)=>{
    return jwt.verify(token,SECRET)
};

module.exports = {
    generateToken,
    verifyToken
}