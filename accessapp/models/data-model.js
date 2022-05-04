var db = require('../database/db');
var schema = {
  "users": ["id", "username", "email", "password", "role"]
};

function readTable (table, cb) {
  let sql = `SELECT * FROM ${table}`;
  let data = {};
  db.all(sql, function(err, rows) {
    if (err) throw(err);            
    rows.forEach(function(row) {
      data[row.id] = {};
      Object.keys(row).forEach(function(k) {
        data[row.id][k] = unescape(row[k]);
      });
    });
    cb(data);  
  });
};

function createRow (table, cb) {
  let sql = `INSERT INTO ${table} DEFAULT VALUES`;
  db.run(sql, cb);
};

function updateRow (table, rb, cb) {
  var pairs = "";
  for (field of schema[table].slice(1)) {
      if (pairs) pairs += ", ";
      pairs += `${field} = '${escape(rb[field])}'`;
  }
  let sql = `UPDATE ${table} SET ${pairs} WHERE id = ?`;
  db.run(sql, rb['id'], cb);
};

function deleteRow (table, id, cb) {
  let sql = `DELETE FROM ${table} WHERE id = ${id};`;
  db.run(sql, cb);
};

module.exports = {   
  schema,
  readTable,
  createRow,
  updateRow,
  deleteRow
}