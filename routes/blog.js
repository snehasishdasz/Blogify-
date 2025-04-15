const express = require('express');
const Blog = require('../models/blog');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { generateToken } = require("../utils/jwt")
const {requireLogin} = require("../middlewares/auth")
const mongoose = require('mongoose');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/uploads`)
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName)
      
    }
})
const upload = multer({ storage: storage })

router.get("/add-new",requireLogin, (req,res)=>{
    return res.render("addBlog",{
        user: req.user
    })
})

router.post("/add-new",requireLogin, upload.single("coverImage"),async (req,res)=>{
    const {title, body} = req.body;
    const blog =await Blog.create({
        body,
        title,
        createdBy: req.user.userId,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    console.log("User in POST /add-new:", req.user);
    // return res.redirect(`/blog/${blog._id}`)
    return res.redirect("/")
})

router.get("/:id",requireLogin, async (req,res)=>{
    const {id} = req.params;
    const blog = await Blog.findById(id).populate("createdBy"); //here we use populate because we want to get the user data who created the blog
    return res.render("blogView",{
        user:req.user,
        blog,
    })
})

module.exports = router;