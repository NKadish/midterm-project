/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { getUserWithEmail, getAllUsers } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    return getAllUsers()
    .then(result => {
      res.send(result);
    })
  });

  ///////////// GET request for Login page
  router.get("/login", (req, res) => {
    res.render("login");
  });

  ///////////// POST request to login
  router.post("/login", (req, res) => {
    const { inputEmail } = req.body;
    return getUserWithEmail(inputEmail)
    .then(user => {
      if (user) {
        req.session.id = user.id;
        res.redirect("/");
      } else {
        res.send("404, WRONG EMAIL");
      }
    })
  });

  /////////////// POST request to logout (NEEDS IMPLEMENTATION ON PAGE)
  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });




  return router;
};
