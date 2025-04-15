// === routes/user.js ===
const express = require('express');
const router = express.Router();
const upload = require("../config/multerconfig")
const { isLoggedIn } = require("../middleware/authentication")
const userModel = require("../models/user");
const postModel = require("../models/post");
const jwt = require('jsonwebtoken');

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    let { username, email, password, age, name } = req.body;
    let user = await userModel.findOne({ email });
    if (user) return res.status(500).send("User already registered");

    let createdUser = await userModel.registerUser({ username, email, password, age, name });
    let token = jwt.sign({ email: email, userid: createdUser._id }, process.env.SECRET_KEY);
    res.cookie("token", token).redirect("/profile");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.send("Something went wrong");

    let isMatch = await userModel.validatePassword(password, user.password);
    if (isMatch) {
        let token = jwt.sign({ email: email, userid: user._id }, process.env.SECRET_KEY);
        res.cookie("token", token).redirect("/profile");
    } else {
        res.redirect("/login");
    }
});

router.get("/profile", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render("profile", { user });
});

router.post("/post", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let { content } = req.body;
    let post = await postModel.create({ user: user._id, content });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
});

router.post("/like/:postId", isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.postId);
    let userId = req.user.userid;

    if (post.likes.includes(userId)) {
        post.likes.pull(userId);
    } else {
        post.likes.push(userId);
    }

    await post.save();
    res.redirect("/profile");
});

router.get("/edit/:postId", isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.postId);
    if (!post || post.user.toString() !== req.user.userid) return res.status(403).send("Unauthorized");
    res.render("edit", { post });
});

router.post("/edit/:postId", isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.postId);
    if (!post || post.user.toString() !== req.user.userid) return res.status(403).send("Unauthorized");

    post.content = req.body.content;
    await post.save();
    res.redirect("/profile");
});

router.get("/profile/upload", isLoggedIn, (req, res) => {
    res.render("profileUpload");
});

router.post("/profile/upload", isLoggedIn, upload.single("image"), async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.profilepic = req.file.filename;
    await user.save();
    res.redirect("/profile");
});

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

module.exports = router;


// === middleware/authentication.js ===
const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
    try {
        let token = req.cookies.token;
        if (!token) return res.redirect("/login");
        let data = jwt.verify(token, process.env.SECRET_KEY);
        req.user = data;
        next();
    } catch (err) {
        return res.redirect("/login");
    }
}

module.exports = { isLoggedIn };


// === models/user.js ===
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect("mongodb://127.0.0.1:27017/miniproject1");

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    profilepic: {
        type: String,
        default: "default.png"
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }]
});

userSchema.statics.registerUser = async function ({ username, email, password, age, name }) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return this.create({ username, email, password: hash, age, name });
};

userSchema.statics.validatePassword = function (password, hash) {
    return bcrypt.compare(password, hash);
};

module.exports = mongoose.model('user', userSchema);


// === app.js (entry file) ===
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRoutes = require("./routes/user")

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRoutes);

app.listen(3000, () => {
    console.log("Server is running at port 3000");
});
