const db = require("../lib/db");
const fs = require("fs");

exports.createThread = (req, res, next) => {
  const mysql = `INSERT INTO thread SET ?`;

  //condition ternaire comme if else
  const thread = req.file
    ? {
        userId: req.body.userId,
        titre: req.body.titre,
        idCategory: req.body.idCategory,
        typeMessage: req.body.typeMessage,
        content: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,   
      }
    : {
        userId: req.body.userId,
        titre: req.body.titre,
        content: req.body.content,
        typeMessage: req.body.typeMessage,
        idCategory: req.body.idCategory,
      };

  db.query(mysql, thread, (err, result) => {
    if (err) {
      throw err;
      return res.status(400).send({
        message: err,
      });
    }
    return res.status(201).send({
      message: "Thread registred !",
    });
  });
};

exports.getAllThread = (req, res, next) => {
  const size = req.query.size;
  const pageNumber = req.query.page;
  const offset = (pageNumber - 1) * size;
  let data = [req.auth.userId];
  

  if (req.params.idCategory) {
    data.push(req.params.idCategory);
  }
 

  const mysql = `
    SELECT t.idthread, t.titre, t.datePost, t.content, t.idCategory, u.email, t.typeMessage,
      SUM(CASE WHEN tl.idThread IS NOT NULL THEN 1 ELSE 0 END) nbLike,
      CASE WHEN utl.idUser IS NOT NULL THEN 1 ELSE 0 END isLikedByConnectedUser
    FROM thread t
    LEFT JOIN likeDislike tl
      ON t.idthread = tl.idThread
    JOIN users u
      ON t.userId = u.idUser
    LEFT JOIN likeDislike utl
      ON t.idthread = utl.idThread AND utl.idUser = ?
    ${req.params.idCategory ? 'WHERE t.idCategory = ?' : ''}
    GROUP BY t.idthread, t.titre, t.datePost, t.idCategory, u.email, t.content, utl.idUser, t.typeMessage
  
    ORDER BY t.idthread 
    DESC LIMIT ${size}
    OFFSET ${offset}`;

  db.query(mysql, data, (err, result) => {
    if (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
    return res.status(201).send(result);
  });
  return res.status(201);
};


exports.getOneThread = (req, res, next) => {
  const mysql = `
    SELECT  t.idthread, t.titre, t.datePost, t.content, u.email,t.typeMessage,
      SUM(CASE WHEN tl.idThread IS NOT NULL THEN 1 ELSE 0 END) nbLike,
      CASE WHEN utl.idUser IS NOT NULL THEN 1 ELSE 0 END isLikedByConnectedUser
    FROM thread t
    LEFT JOIN likeDislike tl
      ON t.idthread = tl.idThread
    JOIN users u
      ON t.userId = u.idUser
    LEFT JOIN likeDislike utl
      ON t.idthread = utl.idThread AND utl.idUser = ?
    WHERE t.idthread = ? 
    GROUP BY t.idthread, t.titre, t.datePost,  u.email, t.content, utl.idUser,t.typeMessage   
    `;
console.log(mysql);
  const threadId = req.params.threadId;

  db.query(mysql, [req.auth.userId, threadId], (err, result) => {
    if (err) {
      throw err;
      return res.status(500).send({
        message: err,
      });
    }
    console.log(result);
    if (result.length === 0) {
      return res.status(404).send({
        message: `Thread not found `,
      });
    }
    return res.status(201).send(result[0]);
  });
};

exports.getAllCategory = (req, res, next) => {
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
}; 

exports.deleteThread = (req, res, next) => {
  const threadId = req.params.threadId;
  const mysqlSelect = "SELECT * FROM thread WHERE idthread = ?";

  db.query(mysqlSelect, [threadId], (err, result) => {
    if (result[0].content) {
      console.log(result[0]);
      const mysql = "DELETE FROM thread WHERE idthread = ?";
      const threadId = req.params.threadId;

      const filename = result[0].content.split("/images/")[1];

      fs.unlink(`images/${filename}`, () => {
        console.log(filename);
        db.query(mysql, [threadId], (err, result) => {
          if (err) {
            throw err;
            return res.status(400).send({
              message: err,
            });
          }
          return res.status(201).send({
            message: "Thread deleted IMAGE SUPPRIMEE !",
          });
        });
      });
    } else {
      const mysql = "DELETE FROM thread WHERE idthread = ?";
      const threadId = req.params.threadId;

      db.query(mysql, [threadId], (err, result) => {
        if (err) {
          throw err;
          return res.status(400).send({
            message: err,
          });
        }
        return res.status(201).send({
          message: "Thread deleted 2 !",
        });
      });
    }
  });
};

exports.modifyThread = (req, res, next) => {
  const threadId = req.params.threadId;
  const mysql = "SELECT * FROM thread WHERE idthread = ?";


  //-------------------------------------------------CA m arche

  db.query(mysql, [threadId], (err, result) => {
    if (result[0]) {
      console.log(result[0]);
          
      const sql = "UPDATE thread SET ? WHERE idthread = ?";
      // const newThread = { 
      //   titre : req.body.titre , 
      //   content : req.body.content,
      //   typeMessage: req.body.typeMessage,
      // };
      let newThread = req.file
    ? {  
        titre: req.body.titre,
        typeMessage: req.body.typeMessage,
        content: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,   
      }
    : {
        titre: req.body.titre,
        content: req.body.content,
        typeMessage: req.body.typeMessage,
      };

      
      let threadId = req.params.threadId;

     console.log(newThread);
     console.log(threadId);
        db.query(sql,  [ newThread, threadId],  (err, result) => {        
        if (err) {
          throw err;
          return res.status(400).send({
            message: err,
          });
        }
        return res.status(201).send({
          message: "thread updated !",
        });
      });
    } 
  });

  //-------------------------------------------------CA MARCHE FIN

  
  // db.query(mysql, [threadId], (err, result) => {
  //   if (result[0]) {
  //     console.log(result[0]);
  //     const mysql = "UPDATE thread SET ? WHERE idthread = ?";

  //     const tiCon = req.file ? { 
  //         titre : req.body.titre , 
          // content : `${req.protocol}://${req.get("host")}/images/${
          //   req.file.filename
          // }`, 
  //         typeMessage: req.body.typeMessage }
  //       : {
  //         titre : req.body.titre , 
  //         content : req.body.content , 
  //         typeMessage: req.body.typeMessage
  //       };


  //     const titre = req.body.titre;
  //     const content = req.body.content;
  //     const threadId = req.params.threadId;

      
  //       db.query(mysql, [tiCon, threadId],  (err, result) => {
  //         console.log(titre);
  //       if (err) {
  //         throw err;
  //         return res.status(400).send({
  //           message: err,
  //         });
  //       }
  //       return res.status(201).send({
  //         message: "thread updated !",
  //       });
  //     });
  //   } 
  // })


  
};

exports.likeDislike = (req, res, next) => {
  //controler si le user a deja liké CE thread si oui supprimer le like sinon l'insérer
  const idUser = req.body.idUser;
  const idThread = req.body.idThread;
  const user = { idUser: req.body.idUser, idThread: req.body.idThread };
  const mysql = `SELECT * FROM likeDislike WHERE idUser = ${idUser} AND idThread = ${idThread}`;

  db.query(mysql, user, (err, result) => {
    if (result && result.length) {
      const mysql = `DELETE FROM likeDislike WHERE idUser = ${idUser} AND idThread = ${idThread}`;

      db.query(mysql, user, (err, result) => {
        if (err) {
          throw err;
          return res.status(400).send({
            message: err,
          });
        }
        return res.status(201).send({
          message: "like deleted !",
        });
      });
    } else {
      const mysql = `INSERT INTO likeDislike SET ?`;
      const user = { idUser: req.body.idUser, idThread: req.body.idThread };

      db.query(
        mysql,
        user,

        (err, result) => {
          if (err) {
            throw err;
            return res.status(400).send({
              message: err,
            });
          }
          return res.status(201).send({
            message: "liked !",
          });
        }
      );
    }
  });
};


// ---------------------   COMMENTAIRE  ------------------------------------------//
exports.createComment = (req, res, next) => {
  const mysql = "INSERT INTO comment SET ?";

  const comment = req.file
    ? {
        userId: req.body.userId,
        titre: req.body.titre,
        idThread: req.body.idThread,
        content: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        userId: req.body.userId,
        titre: req.body.titre,
        idThread: req.body.idThread,
        content: req.body.content,
      };

  db.query(mysql, comment, (err, result) => {
    if (err) {
      throw err;
      return res.status(400).send({
        message: err,
      });
    }
    return res.status(201).send({
      message: "comment registred",
    });
  });
};

exports.getAllComment = (req, res, next) => {
  //-------------------- CA MARCHE -------------------------///
  //const mysql    = "SELECT * FROM comment WHERE idthread = ? ORDER BY datePost DESC";

  // const mysql = `
  //   SELECT u.email, c.titre, c.datePost, c.content
  //   FROM users u
  //   INNER JOIN comment c
  //   ON u.idUser = c.userId
  //   WHERE idthread = ?
  //   ORDER BY datePost DESC
  //   `;
  //-------------------- CA MARCHE -------------------------///

  // const mysql = `
  // SELECT c.idthread, c.titre, c.datePost, c.content, c.idComment, u.email,
  //   SUM(CASE WHEN cl.idThread IS NOT NULL THEN 1 ELSE 0 END) nbLikeComment,
  //   CASE WHEN ucl.idUser IS NOT NULL THEN 1 ELSE 0 END isLikedByConnectedUser
  // FROM comment c
  // LEFT JOIN likeDislike cl
  //   ON c.idThread = cl.idThread
  // JOIN users u
  //   ON c.userId = u.idUser
  // LEFT JOIN likeDislike ucl
  //   ON c.idThread = ucl.idThread AND ucl.idUser = 43
  // WHERE c.idThread = ?
  // GROUP BY c.idthread, c.titre, c.datePost, c.idComment, u.email, c.content, ucl.idUser

  // ORDER BY c.datePost
  // DESC `;

  //-------------------- CA MARCHE -------------------------///

  const mysql = `
    SELECT c.idthread, c.titre, c.datePost, c.content, c.idComment, u.email,
      SUM(CASE WHEN cl.idComment IS NOT NULL THEN 1 ELSE 0 END) nbLikeComment,
      CASE WHEN ucl.idUser IS NOT NULL THEN 1 ELSE 0 END isLikedByConnectedUser
    FROM comment c
    LEFT JOIN commentLike cl
      ON c.idComment = cl.idComment
    JOIN users u
      ON c.userId = u.idUser
    LEFT JOIN commentLike ucl
      ON c.idComment = ucl.idComment AND ucl.idUser = ${req.auth.userId}
    WHERE c.idThread = ?
    GROUP BY c.idthread, c.titre, c.datePost, c.idComment, u.email, c.content, ucl.idUser

    ORDER BY c.datePost 
    DESC `;

  const idThread = req.params.threadId;

  //il veut pas remplacer par " ? " ligne 370
  db.query(mysql, [idThread], (err, result) => {
    if (err) {
      return res.status(400).send({
        message: err,
      });
    }
    return res.status(201).send(result);
  });
  return res.status(201);
};

exports.commentLike = (req, res, next) => {
  //controler si le user a deja liké CE thread si oui supprimer le like sinon l'insérer
  const idUser = req.body.idUser;
  const idComment = req.body.idComment;

  const user = { idUser: req.body.idUser, idComment: req.body.idComment };
  const mysql = `SELECT * FROM commentLike WHERE idUser = ${idUser} AND idComment = ${idComment}`;

  db.query(mysql, user, (err, result) => {
    if (result && result.length) {
      const mysql = `DELETE FROM commentLike WHERE idUser = ${idUser} AND idComment = ${idComment}`;

      db.query(mysql, user, (err, result) => {
        if (err) {
          throw err;
          return res.status(400).send({
            message: err,
          });
        }
        return res.status(201).send({
          message: "comment like deleted !",
        });
      });
    } else {
      const mysql = `INSERT INTO commentLike SET ?`;
      const user = { idUser: req.body.idUser, idComment: req.body.idComment };

      db.query(
        mysql,
        user,

        (err, result) => {
          if (err) {
            throw err;
            return res.status(400).send({
              message: err,
            });
          }
          return res.status(201).send({
            message: "comment liked !",
          });
        }
      );
    }
  });
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.commentId;
  const mysql     = "SELECT * FROM comment WHERE idComment = ?";

  db.query(mysql, [commentId], (err, result) => {
    if (result[0]) {
      console.log(result[0]);
      const mysql = "DELETE FROM comment WHERE idComment = ?";
      const commentId = req.params.commentId;

      db.query(mysql, [commentId], (err, result) => {
        if (err) {
          throw err;
          return res.status(400).send({
            message: err,
          });
        }
        return res.status(201).send({
          message: "comment deleted !",
        });
      });
    }
  });
};


