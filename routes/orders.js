
const express = require('express');
const { showAllOrders, getUserFromCookie, showItemsFromOrders } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    if (!getUserFromCookie(req.session.id)){
      return res.redirect("/");
    } else {
      return getUserFromCookie(req.session.id)
      .then(dbUser => {
        console.log("user: ", dbUser);
        return showAllOrders(dbUser.id)
        .then(orders => {
          console.log("orders: ", orders);
          const templateVars = {
            user: req.session.id,
            orders
          };
          res.render("orders", templateVars);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        })
      })
    }
  });


  return router;
};
