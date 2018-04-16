var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var request = require('request');

var apiKey = process.env.API_KEY || require('../config.js').api_Key;
var appId = process.env.APP_ID || require('../config.js').app_Id;

router.get('/instant', function(req, res){
  console.log('req.query.searchQuery:', req.query.searchQuery);

  var toQuery = req.query.searchQuery;
  var options = {
    url: 'https://trackapi.nutritionix.com/v2/search/instant?query=' + toQuery,
    headers: {
      'x-app-id': appId,
      'x-app-key': apiKey
    }
  };

  request(options, function(err, response, body) {
    if(err) {
      console.log('error:', err);
      res.sendStatus(500);
    } else {
      res.send(JSON.parse(body));
    }
  });
});

router.get('/common', function(req, res){
  console.log('req.body:', req.body);

  var toQuery = req.query.toQuery;
  var options = {
    url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
    method: 'POST',
    headers: {
      'x-app-id': appId,
      'x-app-key': apiKey
    },
    body: {
      "query" : toQuery
    },
    json: true

  };

  request(options, function(err, response, body) {
    if(err) {
      console.log('error:', err);
      res.sendStatus(500);
    } else {
      res.send(body);
    }
  });
});

router.get('/branded', function(req, res){
  console.log('req.query:', req.query);

    var toQuery = req.query.toQuery;
  var options = {
    url: 'https://trackapi.nutritionix.com/v2/search/item?nix_item_id=' + toQuery,
    headers: {
      'x-app-id': appId,
      'x-app-key': apiKey
    }
  };

  request(options, function(err, response, body) {
    if(err) {
      console.log('error:', err);
      res.sendStatus(500);
    } else {
      res.send(JSON.parse(body));
    }
  });
});

router.get('/*', function(req, res) {
  console.log('404 : ', req.params);
  res.sendStatus(404);
});

module.exports = router;
