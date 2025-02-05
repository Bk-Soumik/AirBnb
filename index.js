if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const path = require("path");
const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/userSchema.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
.then((res) => {
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const app = express();
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 36000,
})

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE", err);
})

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000, () => {
    console.log("connected to port 3000");
})

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.use("/", userRouter)
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// app.get("/listings/:id/reviews",(req,res)=>{
//   let {id} = req.params;
//   res.redirect(`/listings/${id}`)
// })

app.all("*", (req,res,next) => {
  next(new ExpressError(404, "page not found"));
})

app.use((err,req,res,next) => {
  let { status = 500, message = "something went wrong" } = err;
  res.status(status).render("listings/error.ejs",{err});
})