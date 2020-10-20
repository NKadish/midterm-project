const express = require('express');
const { showAllOrders, getUserFromCookie, showItemsFromOrders, updateOrderOnCheckout, newOrder, getPlacedOrderId, menuItemsMessage } = require('../server/database');
const router  = express.Router();
const { sendText } = require('../api/twilio');

module.exports = (db) => {

  router.get("/", (req, res) => {
    if (!getUserFromCookie(req.session.id)){
      return res.redirect("./login");
    } else {
      return getUserFromCookie(req.session.id)
      .then(dbUser => {
        return showAllOrders(dbUser.id)
        .then(orders => {
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

  router.post('/', (req, res) => {
    const userId = req.session.id;
    return updateOrderOnCheckout(userId)
    .then(() =>{
      newOrder(req.session.id);
      return getPlacedOrderId(userId)
      .then(orderId => {
        return showItemsFromOrders(orderId.id)
        .then(menuItems => {
          let menuItemString = menuItemsMessage(menuItems);

          res.redirect("/orders")
        })
      })
    })
  });

  return router;
};

