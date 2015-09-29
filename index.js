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
var funct = require('./config/auth_functions');

//hbs custom helper

var Handlebars = require('hbs');
Handlebars.registerHelper('firstLetter', function(passedString) {
  var output = passedString.substring(0,1);
  return new Handlebars.SafeString(output)
});

Handlebars.registerHelper('maxSize', function(passedString){
  if(passedString.length > 12){
    var output = passedString.substring(0,12);
    output = output + "...";
  }
  else {
    var output = passedString;
  }
  return new Handlebars.SafeString(output)
})



// configuration ===========================================
// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
mongoose.connect(db.url, function(err, result){
  if (err){
    console.log("error connecting to mongo. Error: ", err);
  }
  else {
    console.log("connection established to ", db.url);
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
var userRoutes = require('./app/userRoutes');
app.use("/", userRoutes);


passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});

passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localAuth(username, password)
    .then(function (user) {
      if (user) {
        console.log("LOGGED IN AS: " + user.username);
        req.session.success = 'You are successfully logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localReg(username, req.body.firstName, req.body.lastName, req.body.email, req.body.avatar_url, password)
    .then(function (user) {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));



// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

app.get("/", function(req, res){
  res.render("homepage", {user: req.user})
});

app.get('/signin', function(req, res){
  if(req.user){
    res.redirect("/")
  }
  else{
    res.render('signin');
  }
});

app.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/#/',
  failureRedirect: '/#/'
  })
);

app.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/#/',
  failureRedirect: '/#/'
  })
);

app.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/#/');
  req.session.notice = "You have successfully been logged out " + name + "!";
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
