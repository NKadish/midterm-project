const express = require('express');
const { getAllMenu, getActiveOrder } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  ///////////// GET request for Menu page
  router.get("/", (req, res) => {
    return getAllMenu()
      .then(data => {
        const templateVars = {
          user : req.session.id,
          data
        };
        res.render("menu", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  ///////////// POST request for Menu page to add items to cart
  router.post('/', (req, res) => {
    const userId = req.session.id;
    let menuId = req.body.$menuItemId;
    let quantity = req.body.$quantity;
    return getActiveOrder(userId, menuId, quantity);
  });

  return router;
};
