var mongoose = require('mongoose');

//Mongoose Schema Set-up
var floorplanSchema = new mongoose.Schema({
    name: String,
    type: String,
    devices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Devices"
        }
    ],
});

module.exports = mongoose.model("Floorplan", floorplanSchema); 