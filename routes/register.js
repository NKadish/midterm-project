const express = require('express');
const { register, newOrder } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  // GET request to register page
  router.get("/", (req, res) => {
    const templateVars = { user : req.session.id };
    res.render("register", templateVars);
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
        newOrder(user.id);
        res.redirect("/");
      });
    }
  });






  return router;
};
