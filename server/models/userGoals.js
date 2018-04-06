var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Mongoose Schema
var UserGoalsSchema = new Schema({
    username: {type: String, required: true},
    calories: {type: Array},
    fiber: {type: Array},
    protein: {type: Array},
    sodium: {type: Array},
    sugar: {type: Array},
    carbohydrates: {type: Array},
    fat: {type: Array},
});


module.exports = mongoose.model('UserGoals', UserGoalsSchema);
