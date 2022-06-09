const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const db      = require("../lib/db");



exports.login = (req, res, next) => {
    const user = ({ email: req.body.email});  
    const mysql = `SELECT * FROM users WHERE ?`;

    db.query(
      mysql,user,
      (err, result) => {
        if (err) {
          return res.status(400).send({
            message: err,
          });
        }

        if (!result.length) {
       
          return res.status(400).send({
            
            message: "Email or password incorrect !",
          });
        }
  
        bcrypt.compare(
          req.body.password,
          result[0]["password"],
          (bErr, bResult) => {
            if (bErr) {
              // throw bErr;
              return res.status(400).send({
                message: "Email or password incorrect !",
              });
            }
            if (bResult) {
                const token = jwt.sign({
                    email  : result[0].email,
                    idUser : result[0].idUser,
                  },
                  "SECRETKEY",
                  { expiresIn: "7d" }
                );
                return res.status(200).send({
                  message: "Logged ! ",
                  token,      
                  user: result[0],
              
                });
              }
              return res.status(401).send({
                message: "Username or password incorrect !",
              });
            }
          );
        }
      );
};

exports.signup = (req, res, next) => {
    const user = ({ email: req.body.email });
    const mysql = `SELECT idUser FROM users WHERE LOWER(email) = LOWER ?`;
  //on compare si l'utilisateur existe avant de l'enregistrer
  db.query(
    mysql,user,
    (err, result) => {
      if (result && result.length) {
        return res.status(409).send({
          message: "This email is already in use !",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              message: err,
            });
          } else {    
            const user = ({ email: req.body.email, password: hash , name: req.body.name, firstname: req.body.firstname });
            const mysql = `INSERT INTO users SET ?`;
      
            db.query(
                mysql,
                user ,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    message: err,
                  });
                }
                return res.status(201).send({
                  message: "Registred !",
                });
              }
            );
          }
        });
      }
    }
  );
}

exports.deleteUser = (req, res, next) => {

  const user = req.body.email;  
  const mysql = `SELECT * FROM users WHERE email = ? `;


  db.query(mysql, user, (err, result) => {
   
    if (result){
    
      const user = req.body.userId;
      //const sql = "UPDATE users SET roleUserID = 3  WHERE idUser = ? ";
      const sql = "DELETE FROM users WHERE idUser = ? ";

      db.query(sql, user, (err, result) => {
        if (err) {
          throw err;
          return res.status(400).send({
            message: err,
          });
        }
        return res.status(201).send({
          message: "user disconnect !",
        });
      })
    }
  });

};

exports.modifyPassword = (req, res, next) => {
  const mysql      = "UPDATE users SET password = ? WHERE idUser = ?";
  const userId     = req.body.userId;


  bcrypt.hash(req.body.password, 10, (err, hash) => {
    console.log(req);
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: err,
      });
    } else {

      db.query(mysql, [ hash, userId ], (err, result) => {
        if (err) {
          throw err;
          return res.status(400).send({
            message: err,
          });
        }
        return res.status(201).send({
          message: "Password updated !",
        });
      });
    } 
  });
};