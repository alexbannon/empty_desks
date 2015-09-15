var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var path = require("path");
var favicon = require('serve-favicon');

var mongo = require('mongodb');
var mongoose = require('mongoose');

//authentication

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var session = require('express-session');


// configuration ===========================================
// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
mongoose.connect(db.url, function(err, db){
  if (err){
    console.log("error connecting to mongo. Error: ", err);
  }
  else {
    console.log("connection established to ", db);
  }
});

app.use(favicon(__dirname + '/public/images/favicon.ico'));

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

//hbs view engine
app.set("view engine", "hbs");
app.set('views', path.join(__dirname,'/public/views'));


//authentication

app.use(logger('combined'));
app.use(cookieParser());
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

// routes ==================================================
var deskRoutes = require('./app/deskRoutes'); // configure our routes
app.use("/", deskRoutes);


// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

app.get("/", function(req, res){
  res.render("homepage", {})
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// shoutout to the user
console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;
