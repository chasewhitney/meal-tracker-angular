var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Mongoose Schema
var MealEntrySchema = new Schema({
    username: {type: String, required: true},
    date: {type: Object, required: true},
    name: {type: String, required: true},
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
