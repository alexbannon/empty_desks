var express = require("express");
var router = express.Router();
var Desk = require('./models/desk');
var path = require("path");

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes

        // sample api route
        router.get('/api/desks', function(req, res) {
          if(req.user){
            Desk.find({ "users": req.user._id}).sort('-updated_at').exec(function(err, desks) {
              console.log(desks)

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
            console.log(desk)
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
          console.log(req.body.title)
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

        // frontend routes =========================================================
        // route to handle all angular requests

module.exports = router;
