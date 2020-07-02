var mongoose = require('mongoose');

var deviceSchema = mongoose.Schema({
   name: String,
   status: {type: Boolean, default: false}
});

module.exports = mongoose.model("Devices", deviceSchema); 