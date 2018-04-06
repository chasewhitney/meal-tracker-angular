var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Goals = require('../models/userGoals.js');
var User = require('../models/user.js');

// Sends user's goals to client
router.get('/', function(req, res) {
  var userName = req.user.username;
  Goals.find({username:userName}).exec(
    function(err, data) {
      if(err) {
        console.log('save error: ', err);
        res.sendStatus(500);
      } else {
        console.log('RESULTS:', data);
        res.send(data);
      }
  });
});

// Updates user's nutritional goals
router.put('/', function(req,res){
  var data = req.body.data;
  Goals.findOneAndUpdate({username: req.user.username},{calories: data.calories, carbohydrates: data.carbohydrates, fat: data.fat, fiber: data.fiber, protein: data.protein, sodium: data.sodium, sugar: data.sugar},
  function(err, dbUser) {
    if(err) {
      console.log('ERROR updating goals: ', err);
      res.sendStatus(500);
    } else {
      console.log('Success:', dbUser );
      res.sendStatus(201);
    }
  });
});

router.get('/*', function(req, res) {
  console.log('404 : ', req.params);
  res.sendStatus(404);
});

module.exports = router;
