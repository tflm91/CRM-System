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
    if (name !== undefined && quantity !== undefined && !isNaN(quantity) && quantity >= 0 && basePrice !== undefined && !isNaN(basePrice) && basePrice >= 0.01) {
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
    if (name !== undefined && quantity !== undefined && !isNaN(quantity) && quantity >= 0 && basePrice !== undefined && !isNaN(basePrice) && basePrice >= 0.01) {
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
router.post("/special-offer/", function (req, res) {
    var item = Number(req.body.item);
    var quantity = Number(req.body.quantity);
    var price = Number(req.body.price);
    var begin = req.body.begin;
    var expiration = req.body.expiration;
    if (item !== undefined && !isNaN(item) && quantity !== undefined && !isNaN(quantity) && quantity >= 1 && price !== undefined && !isNaN(price) && price >= 0.01 && new Date(begin) !== undefined && new Date(expiration) !== undefined) {
        query("SELECT (? * basePrice) AS usualPrice FROM Item WHERE id = ?", [quantity, item]).then(function (results) {
            if (results.length == 1) {
                var usualPrice = Number(results[0].usualPrice);
                if (price < usualPrice) {
                    if (new Date(begin) <= new Date(expiration)) {
                        query("INSERT INTO SpecialOffer (item, quantity, price, begin, expiration) VALUES (?, ?, ?, ?, ?)", [item, quantity, price, begin, expiration]).then(function () {
                            query("SELECT MAX(id) AS resId FROM SpecialOffer").then(function (results) {
                                var resId = Number(results[0].resId);
                                res.status(201);
                                res.send("/special-offer/" + resId);
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
                        res.status(400);
                        res.send("Error: Offer expires before it begins. ");
                    }
                }
                else {
                    res.status(400);
                    res.send("Error: Offer too expensive. ");
                }
            }
            else {
                res.status(400);
                res.send("Error: Item not found. ");
            }
        }).catch(function (reason) {
            console.log(reason);
            res.sendStatus(500);
        });
    }
    else {
        res.status(400);
        res.send("Error: Invalid arguments. ");
    }
});
router.get("/special-offer", function (req, res) {
    query("SELECT * FROM SpecialOffer").then(function (results) {
        res.status(200);
        res.json(results);
    }).catch(function (reason) {
        console.log("reason");
        res.sendStatus(500);
    });
});
router.put("/special-offer/:id", function (req, res) {
    var id = Number(req.params.id);
    var item = Number(req.body.item);
    var quantity = Number(req.body.quantity);
    var price = Number(req.body.price);
    var begin = req.body.begin;
    var expiration = req.body.expiration;
    if (item !== undefined && !isNaN(item) && quantity !== undefined && !isNaN(quantity) && quantity >= 1 && price !== undefined && !isNaN(price) && price >= 0.01 && new Date(begin) !== undefined && new Date(expiration) !== undefined) {
        query("SELECT (? * basePrice) AS usualPrice FROM Item WHERE id = ?", [quantity, item]).then(function (results) {
            if (results.length == 1) {
                var usualPrice = Number(results[0].usualPrice);
                if (price < usualPrice) {
                    if (new Date(begin) <= new Date(expiration)) {
                        query("UPDATE SpecialOffer SET item = ?, quantity = ?, price = ?, begin = ?, expiration = ? WHERE id = ?", [item, quantity, price, begin, expiration, id]).then(function (results) {
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
                        res.status(400);
                        res.send("Error: Offer expires before it begins. ");
                    }
                }
                else {
                    res.status(400);
                    res.send("Error: Offer too expensive. ");
                }
            }
            else {
                res.status(400);
                res.send("Error: Item not found. ");
            }
        }).catch(function (reason) {
            console.log(reason);
            res.sendStatus(500);
        });
    }
    else {
        res.status(400);
        res.send("Error: Invalid arguments. ");
    }
});
router.delete("/special-offer/:id", function (req, res) {
    var id = Number(req.params.id);
    query("SELECT * FROM SpecialOffer WHERE id = ?", [id]).then(function (results) {
        if (results.length === 1) {
            var expiration = new Date(results[0].expiration);
            var today = new Date;
            if (today >= expiration) {
                console.log(id);
                query("DELETE FROM SpecialOffer WHERE id = ?", [id]).then(function () {
                    res.status(200);
                    res.json(results[0]);
                }).catch(function (reason) {
                    console.log(reason);
                    res.sendStatus(500);
                });
            }
            else {
                res.status(400);
                res.send("Error: Special offer not expired yet. ");
            }
        }
        else {
            res.sendStatus(404);
        }
    }).catch(function (reason) {
        console.log(reason);
        res.sendStatus(500);
    });
});
