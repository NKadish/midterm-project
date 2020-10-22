const express = require('express');
const { showAllOrders, getUserFromCookie, showItemsFromOrders, updateOrderOnCheckout, newOrder, getPlacedOrderId, menuItemsMessage, getPhoneNumberFromId, longestMakeTimeFromOrder, showItemsInEachOrder, menuItemsArr, orderTotal, getTimeForOrder } = require('../server/database');
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
          return showItemsInEachOrder(req.session.id)
          .then(menu => {
            let menuItems = (menuItemsArr(menu))
            let orderTotals = (orderTotal(menu))
            let timeToMake = (getTimeForOrder(menu))
            console.log(orders);
            const templateVars = {
              user: req.session.id,
              orders,
              menuItems,
              orderTotals,
              timeToMake
            };
            res.render("orders", templateVars);
          })

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
    let orderId;
    let orderTime;
    return updateOrderOnCheckout(userId)
    .then(() =>{
      return getPlacedOrderId(userId)
    })
    .then(order => {
      orderId = order.id;
      return showItemsFromOrders(orderId)
    })
    .then(menuItems => {
      let restaurantNum = 6139228549;
      let menuItemString = menuItemsMessage(menuItems);
      // Text to Restaurant with order
      console.log(menuItemString, `+1${restaurantNum}`);
      //sendText(menuItemString, `+1${restaurantNum}`, 0);
      return longestMakeTimeFromOrder(orderId)
    })
    .then(time => {
      orderTime = (time.max);
      return getPhoneNumberFromId(userId)
    })
    .then(number =>{
      // Text to Client with confirmation
      console.log(`Your order will be ready for pick up in ${orderTime} minutes!`, number.phone_number)
      //sendText(`Your order will be ready for pick up in ${orderTime} minutes!`, number.phone_number, 0);
      //sendText(`Your order is ready for pick up!`, number.phone_number, orderTime);
      newOrder(userId);
      res.redirect("/orders");
      })
    .catch(err => {
      console.log(err);
    })
  });

  return router;
};

// router.post('/', (req, res) => {
//   const userId = req.session.id;
//   return updateOrderOnCheckout(userId)
//   .then(() =>{
//     return getPlacedOrderId(userId)
//     .then(orderId => {
//       return showItemsFromOrders(orderId.id)
//       .then(menuItems => {
//         let restaurantNum = 6139228549;
//         let menuItemString = menuItemsMessage(menuItems);
//         // Text to Restaurant with order
//         console.log(menuItemString, `+1${restaurantNum}`);
//         //sendText(menuItemString, `+1${restaurantNum}`);
//         return longestMakeTimeFromOrder(orderId)
//         .then(time => {
//           let orderTime = (time.max);
//           return getPhoneNumberFromId(userId)
//           .then(number =>{
//             // Text to Client with confirmation
//             console.log(`Your order will be ready for pick up in ${orderTime} minutes!`, number.phone_number)
//             //sendText(`Your order will be ready for pick up in ${orderTime} minutes!`, number.phone_number);
//             newOrder(userId);
//             res.redirect("/orders");
//           })
//         })
//       })
//     })
//   })
// });
