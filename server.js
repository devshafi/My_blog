// set up ======================================================================
// get all the tools we need

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');


// configuration ===============================================================
// mongoose.connect(configDB.url);  // this is deprecated method of connecting database

// Using `mongoose.connect`...
var promise = mongoose.connect(configDB.url, {
   useMongoClient: true
  /* other options gose here */
});

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

//app.use(bodyParser());          // this is deprecated method of using body-parser


// this is the latest method of using body-parser
// get information from html forms
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded p ost data
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({resave:false,saveUninitialized:true, secret: 'fozlerabbishafi' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static('public')); // static folder for direct use

// all the routes routes ==================================================
require('./app/routes/route_profile.js')(app, passport);  // load our routes and pass in our app and fully configured passport
require('./app/routes/route_paypal.js')(app); 
require('./app/routes/route_static.js')(app);



// launch ======================================================================
app.listen(port);
console.log('Happily running on port ' + port);