var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var MealEntry = require('../models/mealEntry.js');
var MealFavorite = require('../models/mealFavorite.js');
var User = require('../models/user.js');

router.post('/createEntry', function(req, res, next) {
  var mealObject = req.body;
  mealObject.username = req.user.username;
  var today = new Date();
  mealObject.date = new Date(today.getFullYear(), (today.getMonth()), today.getDate());
  MealEntry.create(mealObject, function(err, post) {
    if(err) {
      console.log('post MealEntry.create -- failure');
      next(err);
    } else {
      console.log('post MealEntry.create -- success');
      res.sendStatus(201);
    }
  });
});

router.post('/addFavorite', function(req, res, next) {
  var favObject = req.body;
  favObject.username = req.user.username;
  MealFavorite.create(mealObject, function(err, post) {
    if(err) {
      console.log('post MealFavorite.create -- failure');
      next(err);
    } else {
      console.log('post MealFavorite.create -- success');
      res.sendStatus(201);
    }
  });
});

router.get('/getTodayProgress', function(req, res) {
  var username = req.user.username;
  var today = new Date();
  searchDate = new Date(today.getFullYear(), (today.getMonth()), today.getDate());
  MealEntry.find({$and:[{date: searchDate}, {username: username}] }, function(err, data) {
    if(err) {
      console.log('find error:', err);
      res.sendStatus(500);
    } else {
      res.send(data);
    }
  });
});

router.get('/*', function(req, res) {
  console.log('404 : ', req.params);
  res.sendStatus(404);
});

module.exports = router;
