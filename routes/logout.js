const express = require('express');
//const { getUserWithEmail, getAllUsers } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  /////////////// POST request to logout (NEEDS IMPLEMENTATION ON PAGE)
  router.post("/", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  return router;
};
