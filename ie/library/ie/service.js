/**
 * Created by lee on 7/11/15.
 */
var mysql = require('mysql')
var _ = require('lodash')
var db = require('../mysql-db/mysql')

var csv = require('fast-csv')
var request = require('request')
var solr = require('solr-client')
var config = require('../../../config')

var client = solr.createClient();

exports.getIEOfficeDropDownList = function (req, callback) {
    var sql = "select TargetCandidateOffice, count(*) '\Records\' " +
        "from ca_ie_search.independent_expenditures " +
        "where TargetCandidateOffice <> \'\'  " +
        "group by TargetCandidateOffice " +
        "having count(*) >= 10 " +
        "order by TargetCandidateOffice; "

    db.getIndependentExpenditures(sql, function (err, results) {
        //console.log(results)
        if (err) {
            console.log(err);
            return callback(err, results);
        }

        return callback(null, results)
    })

};

exports.getCsv = function (req, res, callback) {
    this.getIEDataFromRequestObj(req, 'csv', function (err, results) {
        if (err) console.log(err)
        callback(null, results)

    })


}

exports.getIEmeasureDropDownList = function (req, callback) {
    var sql = "select Election, TargetPropositionID, TargetPropositionName from ca_ie_search.independent_expenditures " +
        "where PropositionExpenditure = 'Y' and TargetPropositionID != 0 " +
        "group by TargetPropositionID, Election, TargetPropositionName order by Election desc, TargetPropositionName asc";

    db.getIndependentExpenditures(sql, function (err, results) {
        //console.log(results)
        if (err) {
            console.log(err);
            return callback(err, results);
        }
        return callback(null, results)
    })
};


exports.getAutoCompletegetExpanderList = function (req, callback) {
    var sql = "select distinct(ExpenderName) from independent_expenditures where ExpenderName LIKE " + mysql.escape("%" + req.query.term + "%");

    db.getIndependentExpenditures(sql, function (err, results) {
        //console.log(results)
        if (err) {
            console.log(err);
            return callback(err, results);
        }
        return callback(null, results)
    })
};

exports.getAutoCompletegetCandidatesList = function (req, callback) {
    var sql = "select distinct(TargetCandidateName) from independent_expenditures where TargetCandidateName LIKE " + mysql.escape("%" + req.query.term + "%")

    db.getIndependentExpenditures(sql, function (err, results) {
        // console.log(results)
        if (err) {
            console.log(err);
            return callback(err, results);
        }
        return callback(null, results)
    })
};


//Interface functionality to DB fields
//All expenders / Just these expenders - ExpenderName
//  Supporting/Opposing dropdown - ExpenderPosition
//Candidates
//  All candidates / Just these candidates - TargetCandidateName
//Candidates for
//    Office - TargetCandidateOffice
//    District - TargetCandidateDistrict
//Ballot Measures
//  All measures / Just these measures - TargetPropositionName
//  Measure Number - TargetPropositionNumber
//Payees and Services (lower priority)
//  All payees / Just these payees - PayeeName
//  All services / Just these services - ExpenditureDscr
//Dates
//  All dates / date range - DateStart, DateEnd
//  Election Cycles - ElectionCycle

function _sortBy(sort) {

    //console.log(sort);


    if(typeof sort === "undefined"){

        sort = "Date";
    }

    var sortObj = {
        "Candidate Name": "TargetCandidateName",
        "Candidate Office": "TargetCandidateOffice",
        "Ballot Measure": "TargetPropositionName",
        "Position": "ExpenderPosition",
        "Expender": "ExpenderName",
        "Expender ID": "ExpenderID",
        "Amount": "Amount",
        "Description": "ExpenditureDscr",
        "Payee": "PayeeName",
        "Date": "DateStart"


    }

    return sortObj[sort];
}

function _sortDir(dir){

    if(typeof dir === "undefined"){

        dir = "descending";
    }

    var sortBy = {
        "ascending" : "asc",
        "descending" : "desc"
    }

    return sortBy[dir];
}

function _convertCommasToSpaces(str){
    return str.replace(/,/g , " ");
}

function _cleanRequestParams(req){
    return client.escapeSpecialChars(req)
}

exports.getIEDataFromRequestObj = function (req, type, callback){

    var rawParams = "&stats=true&countDistinct=true&stats.field=Amount&stats.facet=ExpenderPosition&stats.facet=PropositionExpenditure&stats.facet=CandidateExpenditure";
    var sort = "&sort=DateStart Desc";
    var qsArray = [];
    var qs = config.solr.host + "/solr/caies/select?q=";
    var fl ="&fl=TargetPropositionName,ExpenditureDscr,Amount,ExpenderID,PayeeName,DateEnd,DateStart,PropositionExpenditure,TargetCandidateName,ExpenderPosition,TargetCandidateOffice,ExpenderName,DateRange";
    var json = "&wt=json";
    var zulu = 'T00:00:00Z';
    var rows = '&rows='+ ((type != null && type == 'csv') ? 10000000 : 100);
   // console.log(rows);

    if (req.query.expendername) {
        if (isNaN(req.query.expendername)) {
            qsArray.push( 'ExpenderName:'  + '*'+encodeURIComponent(client.escapeSpecialChars(req.query.expendername).toLowerCase().replace(/ /g,'')) + '*'  );

        } else {
            qsArray.push('ExpenderID:' + '"'+_cleanRequestParams(req.query.expendername)+'"');
        }
    }

    if (req.query.stance) {
        qsArray.push(' ExpenderPosition:' +'"' + _cleanRequestParams(req.query.stance) +'"');
    }
    if (req.query.candidatename ) {
        qsArray.push(' TargetCandidateName:' +'"' +_cleanRequestParams(req.query.candidatename) +'"');
    }

    if (req.query.candidateoffice) {
        qsArray.push(' TargetCandidateOffice:' +'"' + _cleanRequestParams(req.query.candidateoffice) +'"');
    }
    if (req.query.candidatedistrict) {
        qsArray.push(' TargetCandidateDistrict:' +'"' +_cleanRequestParams(req.query.candidatedistrict) +'"');
    }
    if (req.query.propositionname) {
        qsArray.push(' TargetPropositionName:' +'"' +encodeURIComponent(_cleanRequestParams(req.query.propositionname)) +'"');

    }
    if (req.query.propositionnumber) {
        qsArray.push(' TargetPropositionNumber:' +'"' + _cleanRequestParams(req.query.propositionnumber) +'"');
    }
    if (req.query.payeename) {
        qsArray.push(' PayeeName: ' +'"' + _cleanRequestParams(req.query.payeename) +'"')
    }
    if (req.query.services) {
        qsArray.push(' ExpenditureDscr:' +'"' + _cleanRequestParams(req.query.services) +'"');
    }
    if (req.query.electioncycle) {
        qsArray.push(' ElectionCycle:(' +_cleanRequestParams( _convertCommasToSpaces(req.query.electioncycle)) + ')');
    }

    if (req.query.dateend && req.query.datestart) {
        qsArray.push(' DateStart:' +  '[ * TO ' + req.query.dateend+zulu + '] ');

        qsArray.push(' DateEnd:'+'['+ req.query.datestart+zulu +' TO *] ');

    }

    if(req.query.sortBy && req.query.sortDir){
        sort ="&sort=" + _sortBy(req.query.sortBy) + " " + _sortDir(req.query.sortDir);
    }

    var search = qsArray.length > 0 ? qsArray.join(" AND ") : "*:*";
    qs += search;
    qs += rawParams;
    qs += fl;
    qs += json;
    qs += rows;
    qs += sort;

    //console.log(qs);

    request(qs, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var payload = JSON.parse(body);

            if(type === 'search') {
                var ieObject = {
                    title: "independent expenditure",
                    search: search,
                    amount: payload.response.numFound,
                    payload: payload.response.docs,
                    totals: payload.stats.stats_fields.Amount.sum,
                    candidateExpenditures: payload.stats.stats_fields.Amount.facets.CandidateExpenditure.Y,
                    propositionExpenditures: payload.stats.stats_fields.Amount.facets.PropositionExpenditure.Y,
                    expenderSupport: payload.stats.stats_fields.Amount.facets.ExpenderPosition.S,
                    expenderOppose: payload.stats.stats_fields.Amount.facets.ExpenderPosition.O

                }
            }else{
                var headers = {
                    "Amount": "Amount",
                    "DateRange":"DateRange",
                    "ExpenderID": "ExpenderID",
                    "DateStart": "DateStart",
                    "ExpenderName": "ExpenderName",
                    "TargetPropositionName": "TargetPropositionName",
                    "ExpenditureDscr": "ExpenditureDscr",
                    "PayeeName": "PayeeName",
                    "DateEnd": "DateEnd",
                    "PropositionExpenditure": "PropositionExpenditure",
                    "TargetCandidateName": "TargetCandidateName",
                    "ExpenderPosition": "ExpenderPositionS",
                    "TargetCandidateOffice": "TargetCandidateOffice",
                }

                ieObject = payload.response.docs;
                ieObject.unshift(headers);

            }

            callback(null,ieObject);
        }
        else{
            callback(error,null);
        }
    })

}


