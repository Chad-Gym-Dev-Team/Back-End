# Backend

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
```

## Test

```bash
# unit tests
$ npm run test
```

## API Documentation

```bash
# register
POST /register
# login
POST /auth
# get access token
GET /refresh
# logout
GET /logout

# update user info
PUT /user
# delele user
DELETE /user
# get current user info
GET /user/info
# get user cart
GET /user/cart

# get list products per page (10 products per page)
GET /products
# add new product by `Admin` or `Editor` 
POST /products
# add review for current product
POST /products/:id/reviews
# get top product, sort by reviews
GET /products/top
# get product info
GET /products/:id
# remove product by `Admin` or `Editor`
DELETE /products/:id   
# update a product
PUT /products/:id
# add a product to cart
POST /products/:id/addtocart
# remove a product from cart
DELETE /prodcuts/:id/addtocart
```
