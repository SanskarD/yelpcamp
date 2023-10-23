if(process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utilities/ExpressError");

const campgroundsRoute = require("./routes/campgrounds");
const reviewRoute = require("./routes/review");
const userRoute = require("./routes/users");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const mongoSanitize = require('express-mongo-sanitize')

const helmet = require('helmet')

const dbUrl = "mongodb+srv://SanskarD:Sanskar_1211@cluster0.q5b8qsd.mongodb.net/?retryWrites=true&w=majority"
const secret = process.env.SECRET

mongoose.set("strictQuery", false);
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db open");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize())
app.use(helmet({contentSecurityPolicy:false}))

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret
  }
});


const sessionConfig = {
  store,
  name:"sessCookie",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

//Passport Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.query)
  res.locals.currentUser = req.user
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use("/campgrounds", campgroundsRoute);
app.use("/campgrounds/:id/reviews", reviewRoute);
app.use("/", userRoute);


app.get("/fakeUser", async (req, res) => {
  const user = new User({
    email: "helllo2@gmail.com",
    username: "test2"
  });
  const newUser = await User.register(user,"1234")
  res.send(newUser)
});

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("cannot find", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went Wrong!";
  res.status(statusCode);
  res.render("error", { err });
});
// app.get('/makecampground', async (req,res)=>{
//     const camp = new Campground({title:"sanskar",price:"191",description:"what a place",location:"dehradun"})
//     await camp.save();
//         res.send(camp)

// })

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`port ${port} serving`);
});
