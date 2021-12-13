var express = require('express');
var router = express.Router();
var User = require("../models/user_model");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const { route } = require('.');
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
          devices: [],
          zip: 00000,
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

router.get("/page", function(req, res, next){
  try{
    const token = req.headers["x-auth"];
    const userDecoded = jwt.decode(token, secret).username;
    User.findOne({username: userDecoded}, function(err, user){
      if(err){
        res.status(400).json({message: userDecoded, err: err})
      }
      else{
        if(!user){
          res.status(400).json({message: "User authentication error"})
        }
        else{
          if (user.devices.length == 0) {
            res.status(201).json({message: "No devices registered"})
          }
          else {
            res.status(201).json({devices: user.devices})
          }
        }
      }
    });
  }
  catch(ex){
    res.status(401).json({success: false, message: "Invalid JWT"})
  }
});

router.post("/update", function(req, res, next){
  try{
    let toUpdate = {};
    var succ = false;
    var messageStr = "";
    const token = req.headers["x-auth"];
    const userDecoded = jwt.decode(token, secret).username;

    User.findOne({username: userDecoded}, function(err, user){
      if(err){
        res.status(400).json({message: userDecoded, err: err})
      }
      else if(!user){
        res.status(400).json({message: "User authentication error, you are not permitted to register this device"})
      }
      else{ 
        if ("newPass" in req.body){
          //attempt password update
          if(bcrypt.compareSync(req.body.curPass, user.password)){
            const passHash = bcrypt.hashSync(req.body.newPass, 10);
            User.findOneAndUpdate({username: userDecoded}, {password: passHash}, function(err, user){
              if(err){
                //res.status(400).json({message: userDecoded, err: err})
              }
              else if(!user){
                //res.status(400).json({message: "User authentication error, you are not permitted to register this device"})
              }
            });
            messageStr = "Password updated"
            succ = true
            //res.status(201).json({success:true, message: "password updated" })
          }
          else{
            messageStr = "Incorrect Password"
            succ = false
            // res.status(401).json({message: "Incorrect Password"})
          }
        }
        if("zip" in req.body){
          User.findOneAndUpdate({username: userDecoded}, {zip: req.body.zip}, function(err, user){
            if(err){
              //res.status(400).json({message: userDecoded, err: err})
            }
            else if(!user){
              //res.status(400).json({message: "User authentication error, you are not permitted to register this device"})
            }
          });
          succ = true;
          messageStr += " Zip updated"
        }
        if(succ) res.status(201).json({success: succ, message: messageStr })
        else res.status(401).json({success: succ, message: messageStr});
      }
      // if(succ) res.status(201).json({success: succ, message: messageStr })
      // else res.status(401).json({success: succ, message: messageStr});
    });

    // await User.findOneAndUpdate({username: userDecoded}, {toUpdate}, async function(err, user){
    //   if(err){
    //     res.status(400).json({message: toUpdate, err: err})
    //   }
    //   else if(!user){
    //     res.status(400).json({message: "User authentication error"})
    //   }
    //   else{
    //     if(succ) res.status(201).json({success: succ, message: messageStr })
    //     else res.status(401).json({success: succ, message: messageStr});
    //   }
    // });
    // async function ret(){
    //   if(succ) res.status(201).json({success: succ, message: messageStr })
    //   else res.status(401).json({success: succ, message: messageStr});
    // };
    // await ret()
  }
  catch(ex){
    res.status(400).json({success: false, message: ex})
  }
});
router.post('/therm', function(req,res,next){
  //time: Date, temp: Number, humidity: Number, power: Number 
  let data={
    time: req.body.time,
    temp: req.body.temp,
    humidity: req.body.humid,
    power: req.body.power
  }
  try{
    const token = req.headers["x-auth"];
    const userDecoded = jwt.decode(token, secret).username;
    User.findOneAndUpdate({username: userDecoded}, {$push: {readings: data}}, function(err, user){
      if(err){
        res.status(400).json({message: userDecoded, err: err})
      }
      else if(!user){
        res.status(400).json({message: "User authentication error, you are not permitted to register this device"})
      }
      else{ 
        res.status(200).json({message: user.zip});
      }
    });
    }
    catch(ex){
      res.status(401).json({success: false, message: ex})
    }
});

router.get('/zip', function(req, res, next){
  try{
  const token = req.headers["x-auth"];
  const userDecoded = jwt.decode(token, secret).username;
  User.findOne({username: userDecoded}, function(err, user){
    if(err){
      res.status(400).json({message: userDecoded, err: err})
    }
    else if(!user){
      res.status(400).json({message: "User authentication error, you are not permitted to register this device"})
    }
    else{ 
      res.status(200).json({message: user.zip});
    }
  });
  }
  catch(ex){
    res.status(401).json({success: false, message: ex})
  }

})

// route.get('/graphTemp', function(req, res, err){
//   try{
//     const token = req.headers["x-auth"];
//     const userDecoded = jwt.decode(token, secret).username;
//     User.findOne({username: userDecoded}, function(err, user){
//       if(err){
//         res.status(400).json({message: userDecoded, err: err})
//       }
//       else if(!user){
//         res.status(400).json({message: "User authentication error, you are not permitted to register this device"})
//       }
//       else{ 
//         res.status(200).json({message: user.readings});
//       }
//     });
//     }
//     catch(ex){
//       res.status(401).json({success: false, message: ex})
//     }
  
// })

module.exports = router;
