var express = require('express');
var router = express.Router();
var restler = require('restler')

router.get('/', function(req, res) {
    var city, state;
    if(req.query.name != undefined){
        console.log('Name:'+req.query.name);
        var nameArray = req.query.name.split(/[,]/);
        if(nameArray.length != 2){
            res.render('error',{message: 'You must specify City and State name in the following form \
            weather?name=San_Francisco,CA or \
            weather?city=San_Francisco&state=CA', error:{}});
            return
        }
        city = nameArray[0];
        state = nameArray[1].toUpperCase();
        
    }else if (req.query.city != undefined && req.query.state != undefined){
        city = req.query.city;
        state = req.query.state.toUpperCase();
    }else{
        res.render('error',{message: 'You must specify City and State name in the following form \
            weather?name=San_Francisco,CA or \
            weather?city=San_Francisco&state=CA',error:{}});
        return
    }
    console.log("City:"+city);
    console.log("State:"+state);
    var URL = 'http://api.wunderground.com/api/1965faaec27f8b4b/conditions/q/'+state+'/'+city+'.json';
    console.log("URL: "+URL);
    restler.get(URL).on('complete', function (data) {
                console.log(data);
                response=data;
                //console.log("Start parsing data");
                //console.log(data[0]);
                observation = data.current_observation;
                if(observation != undefined){
                    res.render('weather',{location:observation.display_location.full,
                        weather:observation.weather,
                        time:observation.local_time_rfc822,
                        temperature:observation.temperature_string,
                        feelslike:observation.feelslike_string,
                        humidity:observation.relative_humidity,
                        wind:observation.wind_string,
                        icon:observation.icon_url
                    })
                }else{
                    res.render('error',{message: 'Location '+city+","+state+" not found", error: {}});
                    return
                }
            }).on('error', function(error){
                res.render('error',{message: error.message,error: error});
            });
});

module.exports = router;
