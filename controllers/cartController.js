const Cart = require("../models/cart");
const Product = require("../models/products");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// @desc    Add a product to cart
// @route   POST /api/products/:id/addtocart
// @access  Private/User
const addProductToCart = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //Unauthorized
    const refreshToken = cookies.jwt;

    // get user id from jwt
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) return res.sendStatus(403); //Forbidden

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
            return res.sendStatus(403);
    });

    let cart = await Cart.findOne({ user: foundUser._id, isDone: false });
    if (!cart) {
        // create new cart
        cart = new Cart({
            user: foundUser._id,
        });
    };

    // add product to cart
    const product = await Product.findById(req.params.id);
    
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const item = {
        product: product._id,
        name: product.name,
        price: product.price,
        qty: req.body.qty || 1,
        image: product.image,
    };

    const existItem = cart.cartItems.find((x) => x.product.toString() === item.product.toString());
    if (existItem) {
        // update qty
        existItem.qty = item.qty + existItem.qty;
    } else {
        // add new item
        cart.cartItems.push(item);
    }
    
    // save
    const updatedCart = await cart.save();
    res.json(updatedCart);
};

// @desc    Remove a product from cart
// @route   DELETE /api/products/:id/removefromcart
// @access  Private/User
const removeProductFromCart = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //Unauthorized
    const refreshToken = cookies.jwt;

    // get user id from jwt
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) return res.sendStatus(403); //Forbidden

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
            return res.sendStatus(403);
    });

    const cart = await Cart.findOne({ user: foundUser._id, isDone: false });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // remove product from cart
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { qty } = req.body;

    const existItem = cart.cartItems.find((x) => x.product.toString() === product._id.toString());
    if (existItem) {
        // update qty
        existItem.qty = existItem.qty - (qty || 1);
        if (existItem.qty <= 0) {
            cart.cartItems = cart.cartItems.filter((x) => x.product.toString() !== product._id.toString());
        }
    }
    
    // save
    const updatedCart = await cart.save();
    res.json(updatedCart);
};

// @desc    Get cart
// @route   GET /api/products/cart
// @access  Private/User
const getUserCart = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //Unauthorized
    const refreshToken = cookies.jwt;

    // get user id from jwt
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) return res.sendStatus(403); //Forbidden

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
            return res.sendStatus(403);
    });

    const cart = await Cart.findOne({ user: foundUser._id, isDone: false });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.json(cart);
};

module.exports = {
    getUserCart,
    addProductToCart,
    removeProductFromCart,
};