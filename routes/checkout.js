const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    const templateVars = { user : req.session.id };
    res.render("checkout", templateVars);
  });

  router.get("/", (req, res) => {
    let query = `SELECT * FROM menu_items`;
    console.log(query);
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
