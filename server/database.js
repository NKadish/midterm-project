const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});

// add a user to the database
const register =  function(user) {
  const queryString = `INSERT INTO users(name, email, phone_number)
                       VALUES ($1, $2, $3)
                       RETURNING *;
                      `;

  const queryParams = [user.name, user.email, user.phone_number];

  return pool.query(queryString, queryParams)
    .then(res => {
      return res.rows[0];
      }
    );
};
exports.register = register;

// get every item on the menu
const getAllMenu =  function() {
  const queryString = `SELECT name, description, cost, picture_url
                       FROM menu_items;
                      `;

  return pool.query(queryString)
    .then(res => res.rows);
};
exports.getAllMenu = getAllMenu;

// update user to change their info in the db
const updateUser =  function(userUpdate) {
  let queryString = '';

  const queryParams = [userUpdate.id, userUpdate.name, userUpdate.email, userUpdate.phone_number];

  if (userUpdate.name) {
    queryString += `UPDATE users
                    SET name = $2
                    WHERE id = $1;
                   `
  };

  if (userUpdate.email) {
    queryString += `UPDATE users
                    SET email = $3
                    WHERE id = $1;
                   `
  };

  if (userUpdate.phone_number) {
    queryString += `UPDATE users
                    SET phone_number = $4
                    WHERE id = $1;
                   `
  };

  return pool.query(queryString, queryParams)
    .then(res => {
      return res.rows[0];
      }
    );
};
exports.updateUser = updateUser;

// gets all of the orders placed by the logged in user
const showAllOrders =  function(user) {
  const queryString = `SELECT orders.*, carts.*, menu_items.name
                       FROM orders
                       JOIN carts on orders.id = orders_id
                       JOIN menu_items ON carts.menu_id = menu_items.id
                       WHERE user_id = $1;
                      `;

  const queryParams = [user.id];

  return pool.query(queryString, queryParams)
    .then(res => {
      return res.rows[0];
      }
    );
};
exports.showAllOrders = showAllOrders;