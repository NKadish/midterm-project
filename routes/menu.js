const express = require('express');
const { getAllMenu } = require('../server/database');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    return getAllMenu()
      .then(data => {
        const templateVars = { user : req.session.id, data };
        console.log(templateVars);
        res.render("menu", templateVars);
      })
      // .then(data => {
      //   res.send({ data });
      // })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  // router.get("/", (req, res) => {
  //   res.render("menu", templateVars);
  // });

  return router;
};
