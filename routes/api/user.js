const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const cartController = require('../../controllers/cartController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// @route PUT api/user
// @route DELETE api/user
router.route('/')
.put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), userController.updateUser)
.delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), userController.deleteUser);

// @route GET api/user/info
router.route('/info')
.get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), userController.getUser);

// @route GET api/user/cart
router.route('/cart')
.get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), cartController.getUserCart);

module.exports = router;
