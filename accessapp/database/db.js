var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
var db = new sqlite3.Database('./database/mydb.db');

  function selectRow (bodyParam, role) {
    var data = [];
    db.each('SELECT * FROM USERS', function(err, row) {
      data.push(row);
    });
    console.log(data);
    return data;
  }

  function createRow (bodyParam, role) {
    let responseApi = true;
    db.serialize(()=>{
      db.run('INSERT INTO users(username,email,password,role) VALUES(?,?,?,?)', [bodyParam.username, bodyParam.email, bodyParam.password, role], function(err) {
        if (err) {
          console.log(err.message);
          responseApi = false;
        } 
        console.log("New Administrator has been successfully created");
        responseApi = true;
      });
    });
    return responseApi;
  };
  
  // function updateRow (table, rb, cb) {
  //   var pairs = "";
  //   for (field of schema[table].slice(1)) {
  //       if (pairs) pairs += ", ";
  //       pairs += `${field} = '${escape(rb[field])}'`;
  //   }
  //   let sql = `UPDATE ${table} SET ${pairs} WHERE id = ?`;
  //   db.run(sql, rb['id'], cb);
  // };
  
  // function deleteRow (table, id, cb) {
  //   let sql = `DELETE FROM ${table} WHERE id = ${id};`;
  //   db.run(sql, cb);
  // };
  
  module.exports = {
    // readTable,
    createRow,
    selectRow
    // updateRow,
    // deleteRow
  }