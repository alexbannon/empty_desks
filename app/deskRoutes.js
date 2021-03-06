var express = require("express");
var router = express.Router();
var Desk = require('./models/desk');
var path = require("path");

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes
        router.get("/api/alldesks", function(req, res){
          Desk.find({}, function(err, desks){
            res.send(desks)
          })
        })
        
        router.get('/api/desks', function(req, res) {
          if(req.user){
            Desk.find({ "users": req.user._id}).sort('-updated_at').exec(function(err, desks) {

                // if there is an error retrieving, send the error.
                                // nothing after res.send(err) will execute
                if (err){
                  res.send(err);
                }

                res.send(desks); // return all desks in JSON format
            });
          }
          else {
            res.send({});
          }
            // use mongoose to get all desks in the database
        });

        router.get("/api/desks/:id", function(req, res){
          Desk.findOne({ "_id": req.params.id}, function(err, desk){
            if (err) return handleError(err);
            res.send(desk)
          })
        });

        router.put("/api/desks/:id", function(req, res){
          req.body.updated_at = new Date();
          Desk.findOneAndUpdate({ "_id": req.params.id}, req.body, { 'new': true }, function(err, desk){
            if (err) return handleError(err);
            res.send(desk);
          })
        })

        // route to handle creating goes here (router.post)
        router.post('/api/desks', function(req, res){
          if(req.body.title == undefined || req.body.description == undefined){
            res.send({"error": "blank"})
          }
          else {
            req.body.updated_at = new Date();
            Desk.create(req.body, function(err, desk){
              if(err){
                res.send(err)
              }
              else {
                res.send(desk)
              }
            })
          }
        })

        router.delete("/api/desks/:id", function(req, res){
          Desk.findOneAndRemove({ "_id": req.params.id}, function(err, doc){
            res.json({success: true});
          })
        })

        router.get("/api/calendar", function(req,res){
          if(req.user){
            Desk.find({ "users": req.user._id}, function(err, desks) {

                // if there is an error retrieving, send the error.
                                // nothing after res.send(err) will execute
                if (err){
                  res.send(err);
                }
                var events = []
                desks.forEach(function(desk){
                  desk.lists.forEach(function(list){
                    if(list.dueDate){
                      var obj = {};
                      obj["title"] = list.listName;
                      obj["start"] = list.dueDate;
                      events.push(obj);
                    }
                  })
                })
                res.send(events);
            });
          }
          else {
            res.send({});
          }
        })

        // frontend routes =========================================================
        // route to handle all angular requests

module.exports = router;
