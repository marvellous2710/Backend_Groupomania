const express        = require("express");
const userMiddleware = require("../middleware/users");
const userCtrl       = require('../controllers/user');
const router         = express.Router();


router.post('/login', userCtrl.login);

router.post('/signup', userCtrl.signup, userMiddleware.validateRegister);

router.put("/password", userCtrl.modifyPassword);

router.put("/deleteUser", userCtrl.deleteUser);


module.exports = router;
