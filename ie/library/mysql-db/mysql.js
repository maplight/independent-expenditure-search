/**
 * Created by lee on 6/26/15.
 */
var mysql = require('mysql')
var config = require('../../../config')

var pool  = mysql.createPool({
    connectionLimit : 100, //important
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    //port: config.mysql.port
},function(){
    console.log("Connected");
});

/*
--------- IE Queries ------------------
 */

// Get a record from the andidates table
exports.getIndependentExpenditures = function(sql, callback) {

    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query

        var query = connection.query(sql, function(err, results) {
            connection.destroy();
            if(err) { console.log(err); callback(true); return; }
            //results.query = query.sql
            callback(false, results);
        });
    });
};
