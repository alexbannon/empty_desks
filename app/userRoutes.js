var express = require("express");
var router = express.Router();
var User = require('./models/user');
var Desk = require('./models/desk');
var path = require("path");
var bcrypt = require('bcryptjs');

router.get('/api/users', function(req, res) {
    User.find({}, '_id username firstName lastName email', function(err, users) {
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


router.get("/api/search/:search", function(req, res){
  if(!req.user._id){
    res.send({"error": "not authorized"})
    return
  }
  var searchResults = [{"users": []}, {"desks": []}];
  searchTerm = new RegExp(req.params.search, 'i')
  User.find( { $or:[ {'username': searchTerm}, {'firstName': searchTerm}, {'lastName': searchTerm}, {'email': searchTerm}]},
    function(err, users){
      users.forEach(function(user){
        if(user._id != req.user._id){
          searchResults[0].users.push(user);
        }
      })
      Desk.find({"title": searchTerm}, function(err, desks){
        desks.forEach(function(desk){
          searchResults[1].desks.push(desk);
        })
        res.send(searchResults)
      })
    })
});

router.get("/api/users/:id", function(req,res){
  if(req.user){
    User.findOne({"_id": req.params.id}, "_id username firstName lastName email avatar_url", function(err, user){
      res.send(user)
    })
  }
  else{
    res.send({"error": "not authorized"});
  }
})

router.put("/api/users/:id", function(req, res){
  if(req.user._id == req.params.id){
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

router.post("/#/search_results", function(req, res){
  res.send(req.body);
})


module.exports = router;
