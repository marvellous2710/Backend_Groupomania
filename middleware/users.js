const jwt = require("jsonwebtoken");
const { changeUser } = require("../lib/db");

module.exports = {
  validateRegister: (req, res, next) => {
    // username min length 3
    if (!req.body.email || req.body.email.length < 3) {
      return res.status(400).send({
        message: "Please enter a email with min. 3 chars",
      });
    }
    // password min 6 charss
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({
        message: "Please enter a password with min. 6 chars",
      });
    }

  
    next();
  },
  isLoggedIn: () => {},
};
