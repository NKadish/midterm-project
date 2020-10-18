
const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    const templateVars = { user : req.session.id };
    res.render("orders", templateVars);
  });

  router.get("/", (req, res) => {
    let query = `SELECT * FROM orders`;
    db.query(query)
      .then(data => {
        const orders = data.rows;
        res.json({ orders });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
