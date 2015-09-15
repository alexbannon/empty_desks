var Desk = require('./models/desk');
var path = require("path");

    module.exports = function(app) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes

        // sample api route
        app.get('/api/desks', function(req, res) {
            // use mongoose to get all nerds in the database
            Desk.find(function(err, desks) {

                // if there is an error retrieving, send the error.
                                // nothing after res.send(err) will execute
                if (err){
                  res.send(err);
                }

                res.send(desks); // return all nerds in JSON format
            });
        });

        app.get("/api/desks/:id", function(req, res){
          Desk.findOne({ "_id": req.params.id}, 'id title description', function(err, desk){
            if (err) return handleError(err);
            res.send(desk)
          })
        });

        app.put("/api/desks/:id", function(req, res){
          Desk.findOneAndUpdate({ "_id": req.params.id}, req.body, { 'new': true }, function(err, desk){
            if (err) return handleError(err);
            res.send(desk);
          })
        })

        // route to handle creating goes here (app.post)
        app.post('/api/desks', function(req, res){
          console.log(req.body.title)
          if(req.body.title == undefined || req.body.description == undefined){
            res.send("blank")
          }
          else {
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

        app.delete("/api/desks/:id", function(req, res){
          Desk.findOneAndRemove({ "_id": req.params.id}, function(err, doc){
            res.json({success: true});
          })
        })

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('/', function(req, res) {
            res.sendFile('homepage.html', {root: path.join(__dirname, '../public/views') })
        });

    };
