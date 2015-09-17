var express = require("express");
var router = express.Router();
var User = require('./models/user');
var path = require("path");

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
    User.findOneAndUpdate({ "_id": req.params.id}, req.body, { 'new': true}, function(err, user){
      if (err) return handleError(err);
      res.send(user)
    })
  }
  else {
    res.send("not authorized")
  }
  Desk.findOneAndUpdate({ "_id": req.params.id}, req.body, { 'new': true }, function(err, desk){
    if (err) return handleError(err);
    res.send(desk);
  })
})


module.exports = router;
