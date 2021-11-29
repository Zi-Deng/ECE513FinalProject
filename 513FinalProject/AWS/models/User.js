// to use mongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/User", { useNewUrlParser: true, useUnifiedTopology:true });


module.exports = mongoose;
