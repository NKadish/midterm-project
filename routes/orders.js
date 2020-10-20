
const express = require('express');
const { showAllOrders, getUserFromCookie, showItemsFromOrders, updateOrderOnCheckout } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    if (!req.session.id) {
      return res.send("PLEASE LOG IN");
    }
    return showAllOrders(req.session.id)
    .then(data => {
      console.log(data);
      const templateVars = {
        user: req.session.id,
        data
      };
      res.render("orders", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  router.post('/', (req, res) => {
    const userId = req.session.id;
    updateOrderOnCheckout(userId);
    res.redirect("/orders")
  });

  return router;
};
