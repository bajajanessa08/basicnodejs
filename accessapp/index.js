var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');

var app = express();
var sqliteFunction = require('./database/db.js');
const jwt = require("jsonwebtoken");
const port = 2000;
var db = new sqlite3.Database('./database/mydb.db');

app.get("/", (req, res) => {
res.json({
	route: "/",
	authentication: false,
});
});

app.use(express.json());


// Admin Registration Route
app.post("/admin-register", function(req, res){
	const bodyParam = req.body;
	const insertData = sqliteFunction.createRow(bodyParam, 'Administrator');
	if (insertData) {
		console.log("New Administrator has been successfully created");
		res.send("New Administrator has been successfully created");
	}
});

// User Registration Route
app.post("/customer-register", function(req, res){
	const bodyParam = req.body;
	const insertData = sqliteFunction.createRow(bodyParam, 'Customer');
	if (insertData) {
		console.log("New Customer has been successfully created");
		res.send("New Customer has been successfully created");
	}
});

// Admin Login Route
app.post("/admin-login", function(req, res){
	const bodyParam = req.body;
	
	db.all(`Select * from users where username='${bodyParam.username}' and password='${bodyParam.password}' and role='Administrator' limit 1`,function(err,rows){

		if (rows.length > 0) {
			const token = jwt.sign(rows[0], "secret");
			res.json({
			login: true,
			token: token,
			data: rows[0],
			});
		} else {
			res.json({
			login: false,
			error: `please check name and password. ${username}, ${password}`,
			});
		}
	});
});

// Customer Login Route
app.post("/customer-login", function(req, res){
	const bodyParam = req.body;
	
	db.all(`Select * from users where username='${bodyParam.username}' and password='${bodyParam.password}' and role='Customer' limit 1`,function(err,rows){

		if (rows.length > 0) {
			const token = jwt.sign(rows[0], "secret");
			res.json({
			login: true,
			token: token,
			data: rows[0],
			});
		} else {
			res.json({
			login: false,
			error: `please check name and password. ${username}, ${password}`,
			});
		}
	});
});

// Verification Route
app.get("/admin-auth", (req, res) => {
	const token = req.body.token;
	if (token) {
		const decode = jwt.verify(token, "secret");
		if (decode.role === 'Administrator') {
			res.send("Hello World");
		} else {
			res.json({
				login: false,
				data: "Error. This Auth is for Admin Only",
			});
		}
	} else {
		res.json({
		login: false,
		data: "error",
		});
	}
});

// Verification Route
app.get("/customer-auth", (req, res) => {
	const token = req.body.token;
	if (token) {
		const decode = jwt.verify(token, "secret");
		if (decode.role === 'Customer') {
			res.send("Hello World");
		} else {
			res.json({
				login: false,
				data: "Error. This Auth is for Customer Only",
			});
		}
	} else {
		res.json({
		login: false,
		data: "error",
		});
	}
});

app.listen(port, () => {
console.log(`Server is running :
	http://localhost:${port}/`);
});
