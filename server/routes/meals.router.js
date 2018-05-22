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
  MealFavorite.create(favObject, function(err, post) {
    if(err) {
      console.log('post MealFavorite.create -- failure');
      next(err);
    } else {
      console.log('post MealFavorite.create -- success');
      res.sendStatus(201);
    }
  });
});

router.get('/getFavorites', function(req, res, next) {
  var username = req.user.username;
  MealFavorite.find({username: username}, function(err, data) {
    if(err) {
      console.log('get MealFavorites.find -- failure');
      next(err);
    } else {
      console.log('get MealFavorite.find -- success');
      console.log('data is:', data);
      res.send(data);
    }
  });
});

router.get('/fullHistory', function(req, res, next) {
  var username = req.user.username;
  MealEntry.find({username: username}, function(err, data) {
    if(err) {
      console.log('get fullHistory.find -- failure');
      next(err);
    } else {
      console.log('get fullHistory.find -- success');
      console.log('data is:', data);
      res.send(data);
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

router.delete('/deleteFavorite/:id', function(req,res){
  var favId = req.params.id;
  MealFavorite.findByIdAndRemove(favId,
  function(err, favorite) {
    if(err) {
      res.sendStatus(500);
    } else {
      console.log('Success. Deleted favorite.', favorite);
      res.sendStatus(200);
    }
  });
});

router.delete('/deleteEntry/:id', function(req,res){
  var entryId = req.params.id;
  MealEntry.findByIdAndRemove(entryId,
  function(err, entry) {
    if(err) {
      res.sendStatus(500);
    } else {
      console.log('Success. Deleted entry.', entry);
      res.sendStatus(200);
    }
  });
});

router.put('/updateFavorite', function(req,res){
  var fav = req.body;
  fav.username = req.user.username;
  MealFavorite.findOneAndUpdate({_id: fav._id},{name: fav.name, calories: fav.calories, carbohydrates: fav.carbohydrates, fat: fav.fat, fiber: fav.fiber, protein: fav.protein, sodium: fav.sodium, sugar: fav.sugar, servingSize: fav.servingSize},
  function(err, favorite) {
    if(err) {
      console.log('ERROR in meals/updateFavorite: ', err);
      res.sendStatus(500);
    } else {
      console.log('SUCCESS in meals/updateFavorite! Found and updated:', favorite);
      res.sendStatus(201);
    }
  });
});

router.put('/updateEntry', function(req,res){
  var entry = req.body;
  entry.username = req.user.username;
  MealEntry.findOneAndUpdate({_id: entry._id},{name: entry.name, servings: entry.servings, servingSize: entry.servingSize, calories: entry.calories, carbohydrates: entry.carbohydrates, fat: entry.fat, fiber: entry.fiber, protein: entry.protein, sodium: entry.sodium, sugar: entry.sugar},
  function(err, entry) {
    if(err) {
      console.log('ERROR in meals/updateEntry: ', err);
      res.sendStatus(500);
    } else {
      console.log('SUCCESS in meals/updateEntry! Found and updated:', entry);
      res.sendStatus(201);
    }
  });
});

router.get('/*', function(req, res) {
  console.log('404 : ', req.params);
  res.sendStatus(404);
});

module.exports = router;
