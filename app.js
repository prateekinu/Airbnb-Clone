// const Review = require("./models/review.js");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const wrapAsync = require("./utils/wrapAsync.js");
// const Listing = require("./models/listing.js");

if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const { date } = require("joi");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;


main().then(()=>{
    console.log("Connected to database");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err)=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};



// app.get("/",(req,res)=>{
//     res.send("Hii! I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.failed = req.flash("failed");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});

// app.get("/demoUser",async(req,res)=>{
//     let fakeUser = new User({
//         email: "Student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews/", reviewsRouter);
app.use("/", userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req,res,next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.render("listings/error.ejs",{statusCode,message});

    // res.status(statusCode).send(message);
    // res.send("Something Went Wrong!");
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});



























// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "by the mountains",
//         price: 1200,
//         location: "jammu",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved!");
//     res.send("Successful testing! ");
// });