const express = require('express');
const { showCart, totalCostOfOrder, longestMakeTimeFromOrder, updateOrderOnCheckout } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    console.log(req.session.id)
    return showCart(req.session)
    .then(order => {
      let totalCost = 0;
      let timeToMake = 0;
      for (let item of order) {
        totalCost += item.cost;
        if (item.time_to_make > timeToMake) {
          timeToMake = item.time_to_make;
        }
      };
      totalCost = Math.round(totalCost) / 100;
      const templateVars = { user : req.session.id, order , totalCost, timeToMake};
      res.render("checkout", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  return router;
};
