const express = require('express');
const { getAllMenu } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  // router.get("/", (req, res) => {
  //   const templateVars = { user : req.session.id };
  //   res.render("menu", templateVars);
  // });

  router.get("/", (req, res) => {
    return getAllMenu()
      // .then(data => {
      //   res.render("menu", templateVar);
      // })
      .then(data => {
        res.send({ data });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
