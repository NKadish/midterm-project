/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  ///////////// GET request for Login page
  router.get("/login", (req, res) => {
    res.render("login");
  })

  ///////////// POST request to login
  router.post("/login", (req, res) => {
    const { inputEmail } = req.body;
    db.query(`
    SELECT id, name, email FROM users
    WHERE email = $1;
    `, [inputEmail])
    .then(result => {
      if (!result.rows) {
        const { id, name, email } = result.rows[0];
        req.session.id = id;
        res.redirect("/");
      } else {
        res.send("404, WRONG EMAIL");
      }
    });
  })




  return router;
};
