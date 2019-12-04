const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const url = require('url');
// Product model
const Product = require('../models/products.model');
const Review = require('../models/reviews.model');

// Categories and brands
let brands;
let categories;

Product.find().distinct('brand', (error, brandList) => {
  brands = brandList;
});
Product.find().distinct('category', (error, categoryList) => {
  categories = categoryList;
});

router.get('/', (req, res, next) => {
  res.redirect('http://localhost:3000/products/1');
});

router.get('/:page', async (req, res, next) => {
  const perPage = 8;
  const page = req.params.page || 1;


  if (url.parse(req.url).query) {
    const search = url.parse(req.url).query;
    const text = search.slice(2).replace('-', ' ');
    if (search.startsWith('c')) {

      if (text.includes('=')) {

        const index = (text.indexOf('=')) - 1;
        const categoriesString = text.slice(0, index);
        const brandsString = text.slice(index + 2);
        const categoriesArr = categoriesString.split('&');
        const brandsArr = brandsString.split('&');

        Product.find({
            $or: [{
                category: {
                  $in: categoriesArr,
                },
              },
              {
                brand: {
                  $in: brandsArr,
                },
              },
            ],
          })
          .skip((perPage * page) - perPage)
          .limit(perPage)
          .exec((err, products) => {
            Product.countDocuments({
              $or: [{
                  category: {
                    $in: categoriesArr,
                  },
                },
                {
                  brand: {
                    $in: brandsArr,
                  },
                },
              ],
            }).exec((err, count) => {
              if (err) return next(err);
              res.render('products', {
                title: 'Products',
                products,
                current: page,
                brands,
                categories,
                categoriesArr,
                brandsArr,
                pages: Math.ceil(count / perPage),
                user: req.user,
              });
            });
          });
      } else {
        const categoriesArr = text.split('&');

        Product.find({
            category: {
              $in: categoriesArr,
            },
          })
          .skip((perPage * page) - perPage)
          .limit(perPage)
          .exec((err, products) => {
            Product.countDocuments({
              category: {
                $in: categoriesArr,
              },
            }).exec((err, count) => {
              if (err) return next(err);
              res.render('products', {
                title: 'Products',
                products,
                current: page,
                brands,
                categories,
                categoriesArr,
                brandsArr: [],
                pages: Math.ceil(count / perPage),
                user: req.user,
              });
            });
          });
      }
    } else {
      const brandsArr = text.split('&');

      Product.find({
          brand: {
            $in: brandsArr,
          },
        })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, products) => {
          Product.countDocuments({
            brand: {
              $in: brandsArr,
            },
          }).exec((err, count) => {
            if (err) return next(err);
            res.render('products', {
              title: 'Products',
              products,
              current: page,
              brands,
              categories,
              brandsArr,
              categoriesArr: [],
              pages: Math.ceil(count / perPage),
              user: req.user,
            });
          });
        });
    }
  } else {
    Product
      .find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec((err, products) => {
        Product.countDocuments().exec((err, count) => {
          if (err) return next(err);
          res.render('products', {
            title: 'Products',
            products,
            current: page,
            brands,
            categories,
            categoriesArr: [],
            brandsArr: [],
            pages: Math.ceil(count / perPage),
            user: req.user,
          });
        });
      });
  }
});

// get single product
router.get('/product/:seo', (req, res, next) => {
  if (typeof req.params.seo === 'string') {
    Product.findOne({
      seo: req.params.seo,
    }, async (err, product) => {
      await Review.find({
        product: product._id,
      }).populate('user').sort('-insdate').exec((err, reviews) => {
        if (err) next(err);
        res.render('product', {
          product,
          reviews,
          user: req.user,
        });

      });
    });
  }
});

router.post('/reviews', (req, res, next) => {
  if (req.body.text === '' || req.body.rate === undefined) {
    res.redirect(`/products/product/${req.body.seo}`);
  } else {
    Review.create({
      text: req.body.text,
      rate: req.body.rate,
      product: req.body.product,
      user: req.user._id,
    }, (err, result) => {
      if (err) return next(err);
    });
    res.redirect(`/products/product/${req.body.seo}`);
  }
});

router.get('/reviews/:id', (req, res, next) => {
  Review.findOne({
    _id: req.params.id,
  }, (err, review) => {
    if (err) next(err);
    res.json(review);
  });
});

router.put('/reviews/edit/:id', (req, res, next) => {
  Review.findOneAndUpdate({
    _id: req.params.id,
  }, req.body, (err, review) => {
    if (err) next(err);
    res.json(review);
  });
});

router.get('/reviews/remove/:id', (req, res, next) => {
  Review.findOneAndDelete({
    _id: req.params.id,
  }, (err, review) => {
    if (err) next(err);
    res.redirect('back');
  });
});
module.exports = router;