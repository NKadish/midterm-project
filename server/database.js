const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});

// get all users
const getAllUsers =  function() {
  const queryString = `SELECT * FROM users;
                      `;

  return pool.query(queryString)
    .then(result => {
      return result.rows;
      }
    );
};
exports.getAllUsers = getAllUsers;

// add a user to the database
const register =  function(user) {
  const queryString = `INSERT INTO users(name, email, phone_number, password)
                       VALUES ($1, $2, $3, $4)
                       RETURNING *;
                      `;

  const queryParams = [user.name, user.email, user.phone_number, user.password];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.register = register;

// gets a user by their email address
const getUserWithEmail = function(email) {
  const queryString = `SELECT * FROM users
                       WHERE email = $1;
                      `;

  const queryParams = [email];

  return pool.query(queryString, queryParams)
    .then(result => {
      if (result.rows === null) {
        return null;
      } else {
        return result.rows[0];
      }
    });
};
exports.getUserWithEmail = getUserWithEmail;

// get every item on the menu
const getAllMenu =  function() {
  const queryString = `SELECT id, name, description, cost, picture_url
                       FROM menu_items;
                      `;

  return pool.query(queryString)
    .then(result => result.rows);
};
exports.getAllMenu = getAllMenu;

// update user to change their info in the db
const updateUser =  function(userUpdate) {
  let queryString = '';

  const queryParams = [userUpdate.id, userUpdate.name, userUpdate.email, userUpdate.phone_number, userUpdate.password];

  if (userUpdate.name) {
    queryString += `UPDATE users
                    SET name = $2
                    WHERE id = $1;
                   `;
  };

  if (userUpdate.email) {
    queryString += `UPDATE users
                    SET email = $3
                    WHERE id = $1;
                   `;
  };

  if (userUpdate.phone_number) {
    queryString += `UPDATE users
                    SET phone_number = $4
                    WHERE id = $1;
                   `;
  };

  if (userUpdate.password) {
    queryString += `UPDATE users
                    SET password = $5
                    WHERE id = $1;
                   `;
  };

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.updateUser = updateUser;

// gets all of the orders placed by the logged in user
const showAllOrders =  function(userId) {
  let allOrders = [];
  const queryString = `SELECT orders.*, max(menu_items.time_to_make) AS makeTime
                       FROM orders
                       JOIN carts ON orders_id = orders.id
                       JOIN menu_items ON carts.menu_id = menu_items.id
                       WHERE user_id = $1
                       GROUP BY orders.id;
                      `;
  const queryParams = [userId];
  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows;
      });
};
exports.showAllOrders = showAllOrders;

// Gets menu items from orders
const showItemsFromOrders = function(orderId) {
  const queryString = `
  SELECT menu_items.name, carts.quantity
  FROM orders
  JOIN carts ON orders.id = orders_id
  JOIN menu_items ON carts.menu_id = menu_items.id
  WHERE orders.id = $1;`;
  const queryParams = [orderId];

  return pool.query(queryString, queryParams)
  .then(result => {
    return result.rows;
  });
};
exports.showItemsFromOrders = showItemsFromOrders;

// gets the total cost of an order, user is there to make sure it only does it for the user that's logged in
const totalCostOfOrder =  function(order, user) {
  const queryString = `SELECT sum(menu_items.cost)
                       FROM orders
                       JOIN carts ON orders_id = orders.id
                       JOIN menu_items ON carts.menu_id = menu_items.id
                       WHERE orders.id = $1 AND user_id = $2;
                      `;

  const queryParams = [order.id, user.id];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.totalCostOfOrder = totalCostOfOrder;

// gets the highest time to make of the items in an order
const longestMakeTimeFromOrder =  function(orderId) {
  const queryString = `SELECT max(menu_items.time_to_make)
                       FROM orders
                       JOIN carts ON orders_id = orders.id
                       JOIN menu_items ON carts.menu_id = menu_items.id
                       WHERE orders.id = $1;
                      `;

  const queryParams = [orderId];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.longestMakeTimeFromOrder = longestMakeTimeFromOrder;

// gets all the items in the current cart and their prices
const showCart = function(user) {
  const queryString = `SELECT menu_items.name, menu_items.cost, menu_items.picture_url, menu_items.time_to_make, carts.quantity, carts.id
                       FROM orders
                       JOIN carts ON orders_id = orders.id
                       JOIN menu_items ON carts.menu_id = menu_items.id
                       WHERE orders.user_id = $1
                       AND placed_at IS NULL;
                      `;

  const queryParams = [user.id];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows;
      }
    );
};
exports.showCart = showCart;

// create a new order
const newOrder =  function(userId) {
  const queryString = `INSERT INTO orders(user_id)
                       VALUES ($1)
                       RETURNING *;
                      `;

  const queryParams = [userId];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows;
      }
    );
};
exports.newOrder = newOrder;

// when the user goes to add an item to their cart
const addItemToCart =  function(orderId, menuId, quantity) {
  const queryString = `INSERT INTO carts(menu_id, orders_id, quantity)
                       VALUES ($1, $2, $3)
                       RETURNING *;
                      `;

  const queryParams = [menuId, orderId, quantity];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.addItemToCart = addItemToCart;

// when the user goes to add an item to their cart
const removeItemFromCart =  function(cartId) {
  const queryString = `DELETE FROM carts
                       WHERE id = $1
                       RETURNING *;
                      `;

  const queryParams = [cartId];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.removeItemFromCart = removeItemFromCart;

// updates orders on checkout, adding the timestamp that the order was placed at
const updateOrderOnCheckout =  function(userId) {
  const queryString = `UPDATE orders
                       SET placed_at = NOW(), status = 'placed'
                       WHERE user_id = $1
                       AND status = 'active';
                      `;

  const queryParams = [userId];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.updateOrderOnCheckout = updateOrderOnCheckout;

// updates orders on pickup, adding the timestamp that the order was picked up at and setting status to f
const updateOrderOnPickup =  function(orderId) {
  const queryString = `UPDATE order
                       SET picked_up_at = NOW(), status = 'picked up'
                       WHERE id = $1';
                      `;

  const queryParams = [orderId];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.updateOrderOnPickup = updateOrderOnPickup;

const hashPassword = function(password) {
  return bcrypt.hashSync(password, 10);
};
exports.hashPassword = hashPassword;

// Gets ID from cookie session
const getUserFromCookie = (userId) => {
  if (!userId) {
    return null;
  } else {
    const queryString = `
    SELECT * FROM users
    WHERE id = $1;
    `;
    const queryParams = [userId];

    return pool.query(queryString, queryParams)
    .then (result => {
      if (result.rows === []) {
        return null;
      } else {
        return result.rows[0];
      }
    })
  }

};
exports.getUserFromCookie = getUserFromCookie;

// gets the active order and adds an item to the cart.
const getActiveOrder =  function(userId, menuId, quantity) {
  const queryString = `SELECT *
                       FROM orders
                       WHERE user_id = $1 AND status = 'active';
                      `;
  const queryParams = [userId];
  return pool.query(queryString, queryParams)
    .then(result => {
        addItemToCart(result.rows[0].id, menuId, quantity);
      });
};
exports.getActiveOrder = getActiveOrder;

// gets the phone number from a user id
const getPhoneNumberFromId =  function(userId) {
  const queryString = `SELECT phone_number FROM users
                       WHERE id = $1;
                      `;

  const queryParams = [userId];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.getPhoneNumberFromId = getPhoneNumberFromId;

// gets the id of an order that has been placed but not picked up yet
const getPlacedOrderId =  function(userId) {
  const queryString = `SELECT id FROM orders
                       WHERE user_id = $1 AND status = 'placed'
                       ORDER BY id DESC
                       LIMIT 1;
                      `;

  const queryParams = [userId];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
      }
    );
};
exports.getPlacedOrderId = getPlacedOrderId;

const menuItemsMessage = function(arr) {
  let output = '';
  for (const item of arr) {
    output += item.name;
    output += `, Quantity: ${item.quantity} | `
  }
  return output;
}
exports.menuItemsMessage = menuItemsMessage;

const menuItemsArr = function(orders) {
  let menuItems = {};
  let currOrderID = 0;
  for (let order of orders) {
    if (currOrderID === order.id) {
      menuItems[currOrderID].push([`${order.name} Quantity:${order.quantity}`]);
      // menuItems[currOrderID].push(`Quantity:${order.quantity}`);

    } else {
      currOrderID = order.id;
      menuItems[currOrderID] = [[`${order.name} Quantity:${order.quantity}`]];
    }

  }

  return menuItems;
}
exports.menuItemsArr = menuItemsArr;

const orderTotal = function(orders) {
  let total = {};
  let costOfOrder = 0;
  let currOrderID = 0;
  for (let order of orders) {
    if (currOrderID === order.id) {
      costOfOrder = order.quantity * order.cost
      total[currOrderID] += costOfOrder
    } else {
      costOfOrder = 0;
      currOrderID = order.id;
      costOfOrder = order.quantity * order.cost
      total[currOrderID] = costOfOrder
    }
  }
  return total;
}
exports.orderTotal = orderTotal;

const showItemsInEachOrder = function(userId) {
  const queryString = `SELECT menu_items.name, carts.quantity, orders.id, menu_items.cost, menu_items.time_to_make, orders.status
                       FROM orders
                       JOIN carts ON orders.id = orders_id
                       JOIN menu_items ON carts.menu_id = menu_items.id
                       WHERE user_id = $1;
                       `;

  const queryParams = [userId];

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows;
      }
    );
};
exports.showItemsInEachOrder = showItemsInEachOrder;

const getTimeForOrder = function(order) {
  let timeToMake = 0;
  for (let item of order) {
    let orderTime = item.time_to_make;
    if (item.status === "placed") {
      if (timeToMake < orderTime) {
        timeToMake = orderTime;
      }
    }
  }
  return timeToMake;
}
exports.getTimeForOrder = getTimeForOrder;
