const express = require('express');
const { getUserWithEmail, getUserFromCookie } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  ///////////// GET request for Login page
  router.get("/", (req, res) => {
    if (getUserFromCookie(req.session.id)) {
        res.redirect("/");
      } else {
        const templateVars = { user: req.session.id, error: null };
        res.render("login", templateVars);
      }

  });

  ///////////// POST request to login
  router.post("/", (req, res) => {
    const { email, password } = req.body;
    const templateVars = { user: req.session.id, error: 'Something went wrong with the login! Please try again!' };
    return getUserWithEmail(email)
    .then(user => {
      if (user === undefined) {
        // placeholder error for testing purposes, change to generic later
        res.render("login", templateVars);
      } else {
        if (user.password === password) {
          req.session.id = user.id;
          res.redirect("/");
        } else {
          // placeholder error for testing purposes, change to generic later
          res.render("login", templateVars);
        }
      }
    })
  });

  return router;
};
