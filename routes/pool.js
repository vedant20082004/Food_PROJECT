var express = require("express");
var mysql = require('mysql');
var pool=mysql.createConnection({

    host:'localhost',
    port:3306,
    user: 'root',
    password:'12345',
    database:'foods',
    multipleStatements : true,

});

pool.connect(function(err){

    if(err)
        {
            console.log(err)
        }

    else{

        console.log("connected")
    }
})


module.exports = pool