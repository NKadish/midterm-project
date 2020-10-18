const express = require('express');
const { getUserWithEmail, getUserFromCookie } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  ///////////// GET request for Login page
  router.get("/", (req, res) => {
    return getUserFromCookie(req)
    .then(result => {
      if (!result) {
        res.render("login");
      } else {
        const user = result;
        const templateVars = {
          user,
          error: null
        };
        res.redirect("/");
      }
    });
  });

  ///////////// POST request to login
  router.post("/", (req, res) => {
    const { email, password } = req.body;
    return getUserWithEmail(email)
    .then(user => {
      if (user.password === password) {
        req.session.id = user.id;
        res.redirect("/");
      } else {
        res.send("404, COULD NOT LOG IN");
      }
    })
  });

  return router;
};
