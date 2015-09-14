// grab the mongoose module
var mongoose = require('mongoose');

// define our user model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('User', {
    username : {type : String, default: ''},
    email: {type : String, default: ''},
    password_digest: {type : String, default: ''}
});
