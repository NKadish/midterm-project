const express = require('express');
const { register } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  // GET request to register page
  router.get("/", (req, res) => {
    res.render("register");
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
    console.log("name:", name, "Email: ", email, phone_number, password);
    if (!name || !email || !phone_number || !password) {
      res.send("REGISTRATION FAILED");
    } else {
      return register(newUser)
      .then(user => {
        req.session.id = user.id;
        res.redirect("/");
      });
    }
  });






  return router;
};
