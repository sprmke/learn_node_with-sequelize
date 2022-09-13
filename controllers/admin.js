const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  req.user
    .createProduct({
      title,
      price,
      imageUrl,
      description,
    })
    .then((result) => {
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch((error) => console.log(error));
};

exports.getEditProduct = (req, res, next) => {
  const isEditMode = req.query.edit;
  if (!isEditMode) {
    return res.redirect('/');
  }
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: `Edit Product - ${product.title}`,
        path: '/admin/edit-product',
        editing: isEditMode,
        product: product,
      });
    })
    .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  Product.findByPk(productId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch((error) => console.log(error));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  // Product.destroy({ where: { id: productId } })
  //   .then((result) => {
  //     console.log(result);
  //     res.redirect('/admin/products');
  //   })
  //   .catch((error) => console.log(error));

  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch((error) => console.log(error));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((error) => console.log(error));
};
