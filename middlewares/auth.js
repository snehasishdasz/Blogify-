const {verifyToken} = require('../utils/jwt');

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if(!token) {
        return next();
    }
     try{
        const data = verifyToken(token);
        req.user = data;
        next();
     }catch(err){
        return next();
     }
}

function requireLogin(req, res, next) {
   const token = req.cookies.token;
   if (!token) return res.redirect('/user/signin');

   try {
       const data = verifyToken(token);
       req.user = data;
       next();
   } catch {
       res.redirect('/user/signin');
   }
}


module.exports = {isLoggedIn, requireLogin};