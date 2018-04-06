var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Mongoose Schema
var MealEntrySchema = new Schema({
    username: {type: String, required: true},
    date: {type: Object, required: true},
    // time: {type: String},
    name: {type: String, required: true},
    // photo: {type: String},
    servingSize: {type: String},
    servings: {type: Number},
    calories: {type: Number},
    fiber: {type: Number},
    protein: {type: Number},
    sodium: {type: Number},
    sugar: {type: Number},
    carbohydrates: {type: Number},
    fat: {type: Number},
});


module.exports = mongoose.model('MealEntry', MealEntrySchema);
