var Connection = require('tedious').Connection;  
var fs   = require("fs");
var mkdirp = require("mkdirp");
var config = {  
    userName: 'xx',  
    password: 'xx',  
    server: 'xx.xx.xx.xx',  
    // If you are on Microsoft Azure, you need this:  
    options: {encrypt: true, database: 'workMonitoringV1', rowCollectionOnDone: true}  
};  
var connection = new Connection(config);  
connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
    console.log("Connected");  
    executeStatement();  
});  

var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  

function executeStatement() {  
    request = new Request("select *from INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'", function(err) {  
    if (err) {  
        console.log(err);}  
    });  

    request.on('doneInProc', function(rowCount, more, rows) {  
        var tablesList = [];
        rows.forEach(function(row) {  
            tablesList.push(row[2]);
        });  
        generateDirectories(tablesList);
    });  
    connection.execSql(request);  
}  

function generateDirectories(tablesList){
    generateClientCode(tablesList);
    generateServerCode(tablesList);
}

function generateClientCode(tablesList){
    tablesList.forEach(function(table){
        var path = "client/"+table.value;
        mkdirp(path, function(err){
            if(err) return err;
            fs.writeFile(path+"/test.js","File content");
        });
    });
}

function generateServerCode(tablesList){
    tablesList.forEach(function(table){
        var path = "server/"+table.value;
        mkdirp(path, function(err){
            if(err) return err;
            fs.writeFile(path+"/test.java","File content");
        });
    });
}
