var express = require('express');
var router = express.Router();
var Recording = require('../models/recording_model');

/*Register Endpoint*/
// POST request
router.post("/register", function(req, res){
    if(!req.body.zip || !req.body.airQuality){
        res.status(400).json({"error" : "zip and airQuality are required."});
    }
    else if(!req.body.zip.match(/^\d\d\d\d\d$/)){
	res.status(400).json({"error" : "zip and airQuality are required."});
    }
    else{
        const newRecord = new Recording({
            zip: req.body.zip,
            airQuality: req.body.airQuality
        });
        newRecord.save(function(err, record){
            if(err){
                res.status(400).send(err);
            }
            else{
                var msg = {"response" : "Data recorded."};
                res.status(201).json(msg);
            }
        });
    }
});

/*Status Endpoint*/
//GET request
router.get("/status", function(req, res){
    const in_zip = req.query.zip;
    if(!req.query.zip){
        res.status(400).json({"error" : "a zip code is required."});
    }
    else if (in_zip.match(/^\d\d\d\d\d$/)){
        //correct format, allows for variable length zips
        Recording.find({zip: in_zip}, function (err, zips){
                if(err){
    
                    res.status(400).send(err);
                }
                else{
                    if(zips.length == 0){
                        var errormsg = {"error" : "Zip does not exist in the database."};
                        res.status(400).json(errormsg);
                    }
                    else{
                        var sum = 0;
                        var entries = 0;
                        for (let zip of zips){
                            sum+= zip.airQuality
                            entries+=1;
                        }
                        var average = sum/entries;
                        res.status(200).json(average.toFixed(2));
                    }
                }
        });
    }
    else{
        //invalid zip
        var errormsg = {"error" : "a zip code is required."};
        res.status(400).json(errormsg);
    }
});

module.exports = router;
