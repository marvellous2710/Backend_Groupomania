const express    = require("express");
const router     = express.Router();
const auth       = require('../middleware/auth');
const multer     = require('../middleware/multer-config');
const threadCtrl = require('../controllers/thread');
 
//THREAD  
router.post("/", auth, multer,threadCtrl.createThread);
//router.get("/:idCategory?", auth, threadCtrl.getAllThread); //le ? rend optionnel idcategory
router.get("/:threadId", auth,  threadCtrl.getOneThread);
router.put("/:threadId",auth, multer, threadCtrl.modifyThread);
router.delete("/:threadId", auth, threadCtrl.deleteThread);

router.get("/", auth, threadCtrl.getAllThread);
  
//LIKE
router.post("/:threadId/like", auth, threadCtrl.likeDislike);


//COMMENT
router.post("/comment/:threadId", auth, multer,threadCtrl.createComment);
router.get("/comments/:threadId", auth, multer,threadCtrl.getAllComment);
router.post("/:threadId/commentLike", auth, threadCtrl.commentLike);
router.delete("/:threadId/:commentId", threadCtrl.deleteComment);

 
module.exports = router;
