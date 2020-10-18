const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    const templateVars = { user : req.session.id };
    res.render("menu", templateVars);
  });

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM menu_items;`)
      .then(data => {
        const items = data.rows;
        res.json({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
