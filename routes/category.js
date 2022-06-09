const express = require("express");
const router  = express.Router();
const db      = require("../lib/db");


//lien avec le front
//get all categories
router.get("/", (req, res, next) => {
  const mysql = "SELECT * FROM categories";
  
  db.query(mysql, (err, result) => {
    if (err) {
      return res.status(400).send({
        message: err,
      });
    }
    return res.status(201).send(result);
  });
  return res.status(201);
});

//get all typeMessage
router.get("/typeMessage", (req, res, next) => {
  const mysql = "SELECT * FROM typeMessage";
  

  db.query(mysql, (err, result) => {
    if (err) {
      return res.status(400).send({
        message: err,
      });
    }
    return res.status(201).send(result);
  });
  return res.status(201);
});


module.exports = router;
