const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// @route GET api/users
// @route PUT api/users
// @route DELETE api/users
router.route('/')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
