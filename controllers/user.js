const User = require("../models/user.js");

module.exports.signUpForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("failed", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginRender = (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.login = async(req,res)=>{
    req.flash("success", "Welcome Back to the WanderLust");
    let redirectUrl = res.locals.redirectUrl || "listings"
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out! ");
        res.redirect("/listings");
    })
};