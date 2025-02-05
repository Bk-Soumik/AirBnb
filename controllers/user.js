const User = require("../models/userSchema.js");

module.exports.signup = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "welcome to AirBnb");
            res.redirect("/listings");
        })
    }catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.logout = (req,res) => {
    req.logout((err,next) => {
        if(err){
            next(err);
        }
        req.flash("success","you are successfully logged out");
        res.redirect("/listings");
    })
}

module.exports.postLogin = async(req,res) => {
    req.flash("success", "Welcome back to AirBnb");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}