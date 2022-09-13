const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((error) => console.log(error));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findByPk(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((error) => console.log(error));

  // Product.findAll({
  //   where: { id: productId },
  //   attributes: ['id', 'title', 'price', 'imageUrl', 'description'],
  // })
  //   .then((products) => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products',
  //     });
  //   })
  //   .catch((error) => console.log(error));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((error) => console.log(error));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      console.log(cart);
      return cart
        .getProducts()
        .then((products) => {
          res.render('shop/cart', {
            pageTitle: 'Your cart',
            path: '/cart',
            products: products,
          });
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length) {
        product = products[0];
      }

      let newQuantity = 1;
      if (product) {
        // if product exists
      }

      return Product.findByPk(productId)
        .then((product) => {
          return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity },
          });
        })
        .catch((error) => console.log(error));
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((error) => console.log(error));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/orders', {
      pageTitle: 'Your orders',
      path: '/orders',
    });
  });
};

exports.getCheckout = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
    });
  });
};
