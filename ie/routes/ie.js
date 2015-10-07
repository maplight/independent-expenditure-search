/**
 * Created by lee on 7/9/15.
 */
var express = require('express');
var router = express.Router();
var ie = require('../library/ie/service')
var csv = require('express-csv')

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Independent  Expenditure'});
});

router.get('/ExpanderNameAutoComplete', function(req, res, next){

    ie.getAutoCompletegetExpanderList(req, function(err, results){
        if(err){
            res.send("Dropdown Error " + err)
        }
        res.send(results)
    });
});

router.get('/targetCandidateNameAutoComplete', function(req, res, next){

    ie.getAutoCompletegetCandidatesList(req, function(err, results){
        if(err){
            res.send("Dropdown Error " + err)
        }
        res.send(results)
    });
});

router.get('/csvDownload', function(req, res, next){


    ie.getCsv(req,'csv', function(err, results){
        if(err) console.log(err);
        //console.log(results);
        res.csv(results);

    })
})

router.get('/officeDropdown', function(req, res, next){
   ie.getIEOfficeDropDownList(req, function(err, results){
       if(err){
           res.send("Dropdown Error " + err)
       }
       res.send(results)
   });   
});

router.get('/measureDropdown', function(req, res, next){
    ie.getIEmeasureDropDownList(req, function(err, results){
        if(err){
            res.send("Dropdown Error " + err)
        }
        res.send(results)
    });
});



router.get('/search', function (req, res, next) {
    ie.getIEDataFromRequestObj(req,'search',function(err, results){
        if(err) {
        	// console.log("/search error: ", err);
        	res.send("Search Error: " + err);
        }
        // console.log("/search results: ", results);
        res.send(results);
        //next();
    })

});


module.exports = router;
