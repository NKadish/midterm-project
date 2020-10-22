// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const bcrypt     = require('bcrypt');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Cookies
const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const loginRoutes = require("./routes/login");
const logoutRoutes = require("./routes/logout");
const menuRoutes = require("./routes/menu");
const registerRoutes = require("./routes/register");
const ordersRoutes = require("./routes/orders");
const checkoutRoutes = require("./routes/checkout");
const database = require('./server/database');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own

// /login/endpoints
const loginRouter = express.Router();
loginRoutes(loginRouter, database);
app.use("/login", loginRoutes(db));

// /logout/endpoints
const logoutRouter = express.Router();
logoutRoutes(logoutRouter, database);
app.use("/logout", logoutRoutes(db));

// /menu/endpoints
const menuRouter = express.Router();
menuRoutes(menuRouter, database);
app.use("/menu", menuRoutes(db));

// /register/endpoints
const registerRouter = express.Router();
registerRoutes(registerRouter, database);
app.use("/register", registerRoutes(db));

// /orders/endpoints
const ordersRouter = express.Router();
ordersRoutes(ordersRouter, database);
app.use("/orders", ordersRoutes(db));

// /checkout/endpoints
const checkoutRouter = express.Router();
checkoutRoutes(checkoutRouter, database);
app.use("/checkout", checkoutRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  const templateVars = { user : req.session.id };
  res.render("main_page", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
