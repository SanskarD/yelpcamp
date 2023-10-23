const User = require('../models/user')
module.exports.renderRegisterForm  =(req, res) => {
    res.render("users/register");
  }

module.exports.registerUser = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "welcome to yelp Camp");
        res.redirect("/campgrounds");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("register");
    }
  }

  module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
  }

  module.exports.login  = async (req, res) => {
    req.flash("success", "Welcome Back");
    const redirectUrl = res.locals.returnTo || "/campgrounds"
    delete req.session.returnTo
    res.redirect(redirectUrl);
  }

  module.exports.logout = (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Logged Out");
      res.redirect("/campgrounds");
    });
  }