const Product = require("../models/products");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
        ? // TODO Fuzzy Search
        {
            name: {
                $regex: req.query.keyword,
                $options: "i", // case insensitive
            },
        }
        : {};

    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    // Check if product exists
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        res.json({ message: "Product not found" });
    }
};

// @desc    Delete single product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    // Check if product exists
    if (product) {
        await product.deleteOne();
        res.json({ message: "Product removed" });
    } else {
        res.status(404);
        res.json({ message: "Product not found" });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
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

    const product = new Product({
        user: foundUser._id,
        name: "Sample name" || req.body.name,
        price: 0 || req.body.price,
        image: "/images/sample.jpg" || req.body.image,
        brand: "Sample brand" || req.body.brand,
        category: "Sample category" || req.body.category,
        countInStock: 0 || req.body.countInStock,
        numReviews: 0 || req.body.numReviews,
        description: "Sample description" || req.body.description,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = name;
        product.price = price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.status(201).json(updatedProduct);
    } else {
        res.status(404);
        res.json({ message: "Product not found" });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private/User
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;

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
    
    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === foundUser._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            res.json({ message: "Product already reviewed" });
            return;
        }

        const review = {
            user: foundUser._id,
            name: foundUser.name,
            rating: Number(rating),
            comment,
        };

        console.log(review);

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        // Calculate overall average review for a product
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: "Review added" });
    } else {
        res.status(404);
        res.json({ message: "Product not found" });
    }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res) => {
    // Find products and sort by rating in ascending order
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.json(products);
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
};
