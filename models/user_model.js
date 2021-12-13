const db = require("./User");

var User = db.model("User", {
    username:  String,
    password:  String,
    devices:  [{id : String, name: String, token : String}],
    zip: Number,
    readings: [{time: Date, temp: Number, humidity: Number }]
 });

 module.exports = User;