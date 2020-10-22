const express = require('express');
const { register, newOrder, getUserFromCookie, getUserWithEmail } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  // GET request to register page
  router.get("/", (req, res) => {
    if (getUserFromCookie(req.session.id)) {
      res.redirect("/");
    } else {
      const templateVars = { user: req.session.id, error: null };
      res.render("register", templateVars);
    }
  });


  // POST request to register a new user
  router.post("/", (req, res) => {
    const {name, email, phone_number, password} = req.body;
    const newUser = {
      name,
      email,
      phone_number,
      password
    };
    const templateVars = { user: req.session.id, error: '' };
    console.log("name:", name, "Email: ", email, phone_number, password);
    if (!name || !email || !phone_number || !password) {
      templateVars.error = 'Please input all forms!'
      res.render('register', templateVars);
    } else {
      return getUserWithEmail(email)
      .then(checkUser => {
        if (checkUser) {
          templateVars.error = 'That email already is registered! Please try again!'
          res.render('register', templateVars);
        } else {
          return register(newUser)
          .then(user => {
          req.session.id = user.id;
          newOrder(user.id);
          res.redirect("/");
          });
        }
      });
    }
  });






  return router;
};
