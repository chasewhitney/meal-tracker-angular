var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Mongoose Schema
var MealFavoriteSchema = new Schema({
    username: {type: String, required: true},
    name: {type: String, required: true},
    servingSize: {type: String},
    calories: {type: Number},
    fiber: {type: Number},
    protein: {type: Number},
    sodium: {type: Number},
    sugar: {type: Number},
    carbohydrates: {type: Number},
    fat: {type: Number},
});


module.exports = mongoose.model('MealFavorite', MealFavoriteSchema);
