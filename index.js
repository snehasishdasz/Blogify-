const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { isLoggedIn } = require('./middlewares/auth');
const Blog = require('./models/blog');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const PORT = 8000;

mongoose.connect("mongodb://127.0.0.1:27017/blogify").then(e => console.log("MongoDB Connected")).catch(e => console.log(e));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
// app.use(isLoggedIn)


app.get('/',isLoggedIn,async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    return res.render('home', { 
      user: req.user,
      blogs: allBlogs,
     });
})


  
app.use("/user",userRoute);
app.use("/blog", blogRoute);













app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
