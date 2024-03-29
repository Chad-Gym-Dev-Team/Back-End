const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');
const cartController = require('../../controllers/cartController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// @route GET api/products
// @route POST api/products
router.route('/')
    .get(productsController.getProducts)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), productsController.createProduct)

// @route POST api/products/:id/reviews
router.route('/:id/reviews')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), productsController.createProductReview);

// @route POST api/products/:id/addtocart
router.route('/:id/addtocart')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), cartController.addProductToCart)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), cartController.removeProductFromCart);

// @route GET api/products/top
router.get('/top', productsController.getTopProducts);

// @route GET api/products/:id
// @route DELETE api/products/:id
// @route PUT api/products/:id
router.route('/:id')
    .get(productsController.getProductById)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), productsController.deleteProduct)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), productsController.updateProduct);

module.exports = router;