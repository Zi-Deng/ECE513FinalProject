var express = require('express');
var router = express.Router();
var User = require("../models/user_model");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');
secret = fs.readFileSync(__dirname + "/../keys/jwtkey").toString()
//login
router.post('/login', function(req, res, next) {
  User.findOne({username: req.body.username}, function (err, results){
    if(err){
      res.status(400).send(err);
    }
    else{
      if(!results){
        //email not found in db
        res.status(401).json({message: "Incorrect Email or Password"});
      }
      else{
        //verify password
        if(bcrypt.compareSync(req.body.password, results.password)){
          const token = jwt.encode({username : results.username}, secret);
          res.status(201).json({success:true, token: token, message: "Logging you in..." })
        }
        else{
          res.status(401).json({message: "Incorrect Email or Password"})
        }
      }
    }
  });
});

router.post("/signup", function(req, res, next){
  User.findOne({username: req.body.username}, function (err, results){
    if(err){
      res.status(400).send(err);
    }
    else{
      if(results){
        //email already in db
        //noEmail: "No user with that email was found, you may signup <a href='signup.html'>here</a> WTF"
        res.status(401).json({message: "Account with email "+ req.body.username + " already exists, if that is you, sign in <a href='signin.html'>here</a>"});
      }
      else{
        //make account
        const passHash = bcrypt.hashSync(req.body.password, 10);
        const newUser = new User({
          username: req.body.username,
          password: passHash,
          devices: []
        });
        newUser.save(function(err, user){
          if(err){
            res.status(400).json({success: false, err:err});
          }
          else{
            res.status(201).json({success: true, message:"Account created"})
          }
        })
      }
    }
  });
});

router.post("/register", function(req, res, next){
  let device = {
    id: req.body.deviceID,
    name: req.body.deviceName,
    token: req.body.deviceToken
  };
  try{
    const token = req.headers["x-auth"];
    const userDecoded = jwt.decode(token, secret).username;
    User.findOneAndUpdate({username: userDecoded}, {$push: {devices: device}}, function(err, user){
      if(err){
        res.status(400).json({message: userDecoded, err: err})
      }
      else{
        if(!user){
          res.status(400).json({message: "User authentication error, you are not permitted to register this device"})
        }
        else{
          res.status(201).json({message: userDecoded})
        }
      }
    });
  }
  catch(ex){
    res.status(401).json({success: false, message: "Invalid JWT"})
  }
});

module.exports = router;
