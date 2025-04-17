const express = require('express');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
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
    // console.log("User in POST /add-new:", req.user);
    // return res.redirect(`/blog/${blog._id}`)
    return res.redirect("/")
})

router.get("/:id",requireLogin, async (req,res)=>{
    const {id} = req.params;
    const blog = await Blog.findById(id).populate("createdBy"); //here we use populate because we want to get the user data who created the blog
    const comments = await Comment.find({ blogId: id }).populate("createdBy").sort({ createdAt: -1 });
 //here we use populate because we want to get the user data who created the comment
    return res.render("blogView",{
        user:req.user,
        comments,
        blog,
    })
})

router.post("/comment/:blogId",requireLogin, async (req,res)=>{
    const{content} = req.body;
    const{blogId} = req.params;
    const comment  = await Comment.create({
        content,
        blogId,
        createdBy: req.user.userId,
    })
    // console.log("User in POST /comment:", req.user);
    // console.log("Comment created:", comment);
    
    return res.redirect(`/blog/${blogId}`)
})

//Add delete blog feature
router.post('/delete/:blogId', requireLogin, async (req, res) => {
    const {blogId} = req.params;
  
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
  
    // Check if the logged-in user is the creator
    if (blog.createdBy.toString() !== req.user.userId.toString()) {
        return res.status(403).send("Unauthorized");
      } else {
        await Blog.findByIdAndDelete(blogId);
        res.redirect('/');
      }
      
  });

module.exports = router;