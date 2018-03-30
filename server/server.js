var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var passport = require('./strategies/mongo.localstrategy');
var sessionConfig = require('./modules/session.config');

//DB Module
var db = require('./modules/db.config.js');

// Route includes
var indexRouter = require('./routes/index.router');
var userRouter = require('./routes/user.router');
var registerRouter = require('./routes/register.router');
var goalsRouter = require('./routes/goals.router');
var mealsRouter = require('./routes/meals.router');

var port = process.env.PORT || 5000;
var API_KEY = process.env.API_KEY || require('../config.js').api_Key;
var API_ID = process.env.API_ID || require('../config.js').api_Id;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve back static files
app.use(express.static('./server/public'));

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/goals', goalsRouter);
app.use('/meals', mealsRouter);

// Catch all bucket, must be last!
app.use('/', indexRouter);

// Listen //
app.listen(port, function(){
   console.log('Listening on port:', port);
});
