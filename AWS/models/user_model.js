const db = require("./User");

var User = db.model("User", {
    username:  String,
    password:  String,
    devices:  [{id : String, name: String, token : String}]
 });

 module.exports = User;