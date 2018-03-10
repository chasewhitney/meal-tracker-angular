var session = require('express-session');

module.exports = session({
   secret: 'exmachina',
   key: 'user',
   resave: 'true',
   saveUninitialized: false,
   cookie: { maxage: 60000, secure: false }
});
