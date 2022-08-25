const fs = require('fs');
const path = require('path');

const cartPath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch  the previous cart
    fs.readFile(cartPath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // analyze the cart => find existing product
      const existingProductIndex = cart.products.findIndex(p => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // add new product / increase quantity
      if (existingProduct) {
        updatedProduct = existingProduct;
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      // update product.json
      fs.writeFile(cartPath, JSON.stringify(cart), err => console.log(err));
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(cartPath, (err, fileContent) => {
      if (err) { return; }
      const updatedCart = JSON.parse(fileContent);
      const product = updatedCart.products.find(p => p.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(p => p.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
      fs.writeFile(cartPath, JSON.stringify(updatedCart), err => console.log(err));
    });
  }

  static getCart(cb) {
    fs.readFile(cartPath, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null)
      } else {
        cb(cart);
      }
    });
  }
}