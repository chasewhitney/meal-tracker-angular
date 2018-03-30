var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Meals = require('../models/userGoals.js');
var User = require('../models/user.js');



router.get('/*', function(req, res) {
  console.log('404 : ', req.params);
  res.sendStatus(404);
});

module.exports = router;
