"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mysql = require("mysql");
var connection = mysql.createConnection({
    database: "CRMSystemDB",
    host: "localhost",
    user: "root"
});
connection.connect(function (err) {
    if (err != null) {
        console.log("DB-Error: " + err);
    }
});
function query(sql, param) {
    if (param === void 0) { param = []; }
    return new Promise(function (resolve, reject) {
        connection.query(sql, param, function (err, results) {
            if (err === null) {
                resolve(results);
            }
            else {
                reject(err);
            }
        });
    });
}
var router = express();
router.listen(8080);
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
