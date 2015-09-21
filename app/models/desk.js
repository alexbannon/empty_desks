var mongoose = require('mongoose');

// define our desk model
// module.exports allows us to pass this to other files when it is called
var deskSchema = new mongoose.Schema({
  title: String,
  description: String,
  lists: Array,
  users: Array,
  updated_at: Date
})

module.exports = mongoose.model('Desk', deskSchema);
