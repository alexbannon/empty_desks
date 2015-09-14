var User = require('./models/user');

    module.exports = function(app) {

      var path = require("path");

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes

        app.get('/users', function(req, res) {
            // use mongoose to get all users in the database
            User.find(function(err, users) {

                // if there is an error retrieving, send the error.
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(users); // return all users in JSON format
            });
        });

        // route to handle creating goes here (app.post)
        // route to handle delete goes here (app.delete)

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('/', function(req, res) {
          res.sendFile('index.html', { root: path.join(__dirname, '../public/views') });         });

    };
