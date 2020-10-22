const express = require('express');
const { showAllOrders, getUserFromCookie, showItemsFromOrders, updateOrderOnCheckout, newOrder, getPlacedOrderId, menuItemsMessage, getPhoneNumberFromId, longestMakeTimeFromOrder, showItemsInEachOrder, menuItemsArr, orderTotal, getTimeForOrder } = require('../server/database');
const router  = express.Router();
const { sendText } = require('../api/twilio');

// Twilio trial version can only send texts to verified numbers, these are the numbers we have verified for testing purposes.
const RESTAURANTNUM = 6139228549;


module.exports = (db) => {

  /////////// GET request to Orders page
  router.get("/", (req, res) => {
    const userId = req.session.id;
    let orders;
    // If user is not logged in, redirect to login page
    if (!getUserFromCookie(userId)) {
      return res.redirect("./login");
    } else {
      return getUserFromCookie(userId)
        .then(dbUser => {
          return showAllOrders(dbUser.id);
        })
        .then(order => {
          orders = order;
          return showItemsInEachOrder(userId);
        })
        .then(menu => {
          let menuItems = (menuItemsArr(menu));
          let orderTotals = (orderTotal(menu));
          const templateVars = {
            user: userId,
            orders,
            menuItems,
            orderTotals,
          };
          res.render("orders", templateVars);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    }
  });

  //////////// POST request to Orders page to place an order
  router.post('/', (req, res) => {
    const userId = req.session.id;
    let orderId;
    let orderTime;
    return updateOrderOnCheckout(userId)
      .then(() =>{
        return getPlacedOrderId(userId);
      })
      .then(order => {
        orderId = order.id;
        return showItemsFromOrders(orderId);
      })
      .then(menuItems => {
        let menuItemString = menuItemsMessage(menuItems);

        // Text to Restaurant with order
        sendText(menuItemString, `+1${RESTAURANTNUM}`, 0);
        // console.log(menuItemString, `+1${restaurantNum}`);
        return longestMakeTimeFromOrder(orderId);
      })
      .then(time => {
        orderTime = (time.max);
        return getPhoneNumberFromId(userId);
      })
      .then(number =>{
        // Text to Client with confirmation
        sendText(`Your order will be ready for pick up in ${orderTime} minutes!`, number.phone_number, 0);
        // console.log(`Your order will be ready for pick up in ${orderTime} minutes!`, number.phone_number);

        // Text to Client once order is ready
        sendText(`Your order is ready for pick up!`, number.phone_number, orderTime, orderId);
        newOrder(userId);
        res.redirect("/orders");
      })
      .catch(err => {
        console.log(err);
      });
  });

  return router;
};
