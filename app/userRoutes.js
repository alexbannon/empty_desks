var express = require("express");
var router = express.Router();
var User = require('./models/user');
var path = require("path");
var bcrypt = require('bcryptjs');

router.get('/api/users', function(req, res) {
    User.find(function(err, users) {
      if (err){
        res.send(err);
      }
      res.send(users);
    });
});

//current_user allows angular to get user ID

router.get('/api/confirm/current_user', function (req, res) {
  if(req.user){
    res.send(req.user)
  }
  else {
    res.send("error")
  }
})


router.get("/api/users/:id", function(req, res){
  User.findOne({ "_id": req.params.id}, 'username', function(err, user){
    if (err) return handleError(err);
    res.send(user)
  })
});

router.put("/api/users/:id", function(req, res){
  if(req.user._id == req.params.id){
    console.log(req.session.passport.user)
    if (bcrypt.compareSync(req.body.password, req.body.password_digest)) {
      var user = {
        "username": req.body.username,
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "avatar_url": req.body.avatar_url,
        "password_digest": req.body.password_digest
      }
      User.findOneAndUpdate({ "_id": req.params.id}, user, { 'new': true}, function(err, user){
        if (err) return handleError(err);
        req.session.passport.user = user
        res.send(user)
      })
    }
    else {
      res.send({"error": "incorrect password"})
    }
  }
  else {
    res.send({"error": "not authorized"})
  }
})


module.exports = router;
