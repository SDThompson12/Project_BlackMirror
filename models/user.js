var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: {type: Boolean, default: false},
    floorPlans: 
    {
        id: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Floorplan"
        },
        name: String,
        type: String
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);