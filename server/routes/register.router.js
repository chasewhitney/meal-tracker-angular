var express = require('express');
var router = express.Router();
var Users = require('../models/user.js');
var UserGoals = require('../models/userGoals.js');
var path = require('path');


// Handles request for HTML file
router.get('/', function(req, res, next) {
  console.log('get /register route');
  res.sendFile(path.resolve(__dirname, '../public/views/templates/register.html'));
});

// Handles POST request with new user data
router.post('/', function(req, res, next) {
  console.log('post /register route');

  var userToSave = {
    username : req.body.username,
    password : req.body.password
  };

  var defaultUserGoals = {
    username: req.body.username,
    calories: [2000,2000],
    cholesterol: [300,300],
    fiber: [25,25],
    protein: [50,50],
    sodium: [2400,2400],
    sugar: [0,0],
    carbohydrates: [300,300],
    fat: [65,65],
  };

  Users.create(userToSave, function(err, post) {
    console.log('post /register -- User.create');
    if(err) {
      console.log('post /register -- User.create -- failure');
      // next() here would continue on and route to routes/index.js
      next(err);
    } else {
      console.log('post /register -- User.create -- success');
      // Creates a default set of nutritional goals for the user upon registration
      UserGoals.create(defaultUserGoals, function(err, post) {
        console.log('post /register -- UserGoals.create');
        if(err) {
          console.log('post /register -- UserGoals.create -- failure');
          next(err);
        } else {
          console.log('post /register -- UserGoals.create -- success');
          res.redirect('/');
        }
      });
    }
  });
});

module.exports = router;
