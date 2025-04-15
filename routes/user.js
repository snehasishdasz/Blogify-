const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { generateToken } = require("../utils/jwt")
const {isLoggedIn} = require("../middlewares/auth")
const mongoose = require('mongoose');



router.get("/signup", (req, res) => {
    return res.render("signup")
});

router.get("/signin", (req, res) => {
    return res.render("signin")
});

router.post("/signup", async (req, res) =>{
    const {fullName, email, password} = req.body;

    // Check if the user already exists
    let user = await User.findOne({email})
    if(user){
        return res.status(500).send("User already registered")
    }
    
    let createdUser = await User.create({
        fullName,
        email,
        password,
    });
    const token = generateToken(createdUser); // use your function
    res.cookie("token", token); // set token as cookie
    console.log(createdUser);
    return res.redirect("/")
})

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            return res.render("signin", { error: "User not found. Please register." });
        }

        let isMatch = await user.comparePassword(password);

        if (isMatch) {
            const token = generateToken(user);
            res.cookie("token", token);
            return res.redirect("/");
        } else {
            return res.render("signin", { error: "Incorrect password" }); // 🔥 Add this!
        }
    } catch (error) {
        console.error("Signin Error:", error);
        return res.render("signin", { error: "Something went wrong. Please try again." });
    }
});



router.post("/logout",(req,res)=>{
    res.clearCookie("token")
    res.redirect("/")
})

module.exports = router;