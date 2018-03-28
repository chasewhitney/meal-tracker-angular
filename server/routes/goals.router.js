var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Goals = require('../models/userGoals.js');
var User = require('../models/user.js');


router.get('/', function(req, res) {
  var userName = req.user.username;
  console.log('username:', userName);
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

router.get('/*', function(req, res) {
  console.log('404 : ', req.params);
  res.sendStatus(404);
});

module.exports = router;
