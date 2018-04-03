var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var MealEntry = require('../models/mealEntry.js');
var User = require('../models/user.js');

// Handles POST request with new user data
router.post('/createEntry', function(req, res, next) {
  console.log('log the data: ', req.body);
  console.log('log the user: ', req.user);

  var mealObject = req.body;
  mealObject.username = req.user.username;
  mealObject.date = new Date();

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

router.get('/*', function(req, res) {
  console.log('404 : ', req.params);
  res.sendStatus(404);
});

module.exports = router;
