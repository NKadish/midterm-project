const express = require('express');
const { getUserWithEmail, getAllUsers } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  ///////////// GET request for Login page
  router.get("/", (req, res) => {
    res.render("login");
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
