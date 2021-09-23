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
router.post("/customer", function (req, res) {
    var lastName = req.body.lastName;
    var firstName = req.body.firstName;
    var street = req.body.street;
    var houseNumber = Number(req.body.houseNumber);
    var postalCode = Number(req.body.postalCode);
    var city = req.body.city;
    var emailAddress = req.body.emailAddress;
    var phoneNumber = req.body.phoneNumber;
    if (lastName !== undefined && firstName !== undefined && street !== undefined && houseNumber !== undefined && !isNaN(houseNumber) && postalCode !== undefined && !isNaN(postalCode) && city !== undefined && emailAddress !== undefined && phoneNumber !== undefined) {
        query("INSERT INTO Customer (lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber]).then(function () {
            var id;
            query("SELECT MAX(id) AS resId FROM Customer").then(function (results) {
                id = Number(results[0].resId);
                res.status(201);
                res.send("/customer/" + id);
            }).catch(function (reason) {
                console.log(reason);
                res.sendStatus(500);
            });
        }).catch(function (reason) {
            console.log(reason);
            res.sendStatus(500);
        });
    }
    else {
        res.sendStatus(400);
    }
});
router.get("/customer", function (req, res) {
    query("SELECT * FROM Customer").then(function (results) {
        res.status(200);
        res.json(results);
    }).catch(function (reason) {
        console.log("reason");
        res.sendStatus(500);
    });
});
router.put("/customer/:id", function (req, res) {
    var id = req.params.id;
    var lastName = req.body.lastName;
    var firstName = req.body.firstName;
    var street = req.body.street;
    var houseNumber = Number(req.body.houseNumber);
    var postalCode = Number(req.body.postalCode);
    var city = req.body.city;
    var emailAddress = req.body.emailAddress;
    var phoneNumber = req.body.phoneNumber;
    if (lastName !== undefined && firstName !== undefined && street !== undefined && houseNumber !== undefined && !isNaN(houseNumber) && postalCode !== undefined && !isNaN(postalCode) && city !== undefined && emailAddress !== undefined && phoneNumber !== undefined) {
        query("UPDATE Customer SET lastName = ?, firstName = ?, street = ?, houseNumber = ?, postalCode = ?, city = ?, emailAddress = ?, phoneNumber = ? WHERE id = ?", [lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber, id]).then(function (results) {
            if (results.affectedRows === 1) {
                res.sendStatus(200);
            }
            else {
                res.sendStatus(404);
            }
        }).catch(function (reason) {
            console.log(reason);
            res.sendStatus(500);
        });
    }
    else {
        res.sendStatus(400);
    }
});
router.delete("/customer/:id", function (req, res) {
    var id = req.params.id;
    query("SELECT * FROM Customer WHERE id = ?", [id]).then(function (results) {
        if (results.length == 1) {
            query("DELETE FROM Customer WHERE id = ?", [id]).then(function () {
                res.status(200);
                res.json(results[0]);
            }).catch(function (reason) {
                console.log(reason);
                res.sendStatus(400);
            });
        }
        else {
            res.sendStatus(404);
        }
    }).catch(function (reason) {
        console.log(reason);
        res.sendStatus(500);
    });
});
router.post("/item", function (req, res) {
    var name = req.body.name;
    var quantity = Number(req.body.quantity);
    var basePrice = Number(req.body.basePrice);
    if (name !== undefined && quantity !== undefined && !isNaN(quantity) && basePrice !== undefined && !isNaN(basePrice)) {
        query("INSERT INTO Item (name, quantity, basePrice) VALUES (?, ?, ?)", [name, quantity, basePrice]).then(function () {
            var id;
            query("SELECT MAX(id) AS resId FROM Item").then(function (results) {
                id = Number(results[0].resId);
                res.status(201);
                res.send("/item/" + id);
            }).catch(function (reason) {
                console.log(reason);
                res.sendStatus(500);
            });
        }).catch(function (reason) {
            console.log(reason);
            res.sendStatus(500);
        });
    }
    else {
        console.log(name === undefined);
        console.log(quantity === undefined);
        console.log(basePrice === undefined);
        console.log(isNaN(quantity));
        console.log(isNaN(basePrice));
        res.sendStatus(400);
    }
});
router.get("/item", function (req, res) {
    query("SELECT * FROM Item").then(function (results) {
        res.status(200);
        res.json(results);
    }).catch(function (reason) {
        console.log("reason");
        res.sendStatus(500);
    });
});
router.put("/item/:id", function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var quantity = Number(req.body.quantity);
    var basePrice = Number(req.body.basePrice);
    if (name !== undefined && quantity !== undefined && !isNaN(quantity) && basePrice !== undefined && !isNaN(basePrice)) {
        query("UPDATE Item SET name = ?, quantity = ?, basePrice = ? WHERE id = ?", [name, quantity, basePrice, id]).then(function (results) {
            if (results.affectedRows === 1) {
                res.sendStatus(200);
            }
            else {
                res.sendStatus(404);
            }
        }).catch(function (reason) {
            console.log(reason);
            res.sendStatus(500);
        });
    }
    else {
        res.sendStatus(400);
    }
});
router.delete("/item/:id", function (req, res) {
    var id = req.params.id;
    query("SELECT * FROM Item WHERE id = ?", [id]).then(function (results) {
        if (results.length == 1) {
            query("DELETE FROM Item WHERE id = ?", [id]).then(function () {
                res.status(200);
                res.json(results[0]);
            }).catch(function (reason) {
                console.log(reason);
                res.sendStatus(400);
            });
        }
        else {
            res.sendStatus(404);
        }
    }).catch(function (reason) {
        console.log(reason);
        res.sendStatus(500);
    });
});
