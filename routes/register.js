const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // GET request to register page
  router.get("/", (req, res) => {
    res.render("register");
  });

  /*
  // POST request to register a new user
  router.post("/", (req, res) => {
    const {name, email, phone_number, password} = req.body;
    db.query(`
    INSERT NEW USER TO USER DATABASE <-----
    RETURNING *;
    `, [name, email, phone_number])
    .then(result => {
      const {id, name, email, phone_number} = result.rows[0];
      req.session.id = id;
      res.redirect(req.baseURL + "/");
    });
  })

  */





  return router;
};
