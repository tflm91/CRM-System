"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mysql = require("mysql2");
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
        connection.query("INSERT INTO Customer (lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber], function (err, result) {
            if (err != null) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                res.status(201);
                res.send("/customer/" + result.insertId);
            }
        });
    }
    else {
        res.sendStatus(400);
    }
});
router.get("/customer", function (req, res) {
    connection.query("SELECT * FROM Customer", [], function (err, result) {
        if (err != null) {
            console.log(err);
            res.sendStatus(500);
        }
        else {
            res.status(200);
            res.json(result);
        }
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
        connection.query("UPDATE Customer SET lastName = ?, firstName = ?, street = ?, houseNumber = ?, postalCode = ?, city = ?, emailAddress = ?, phoneNumber = ? WHERE id = ?", [lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber, id], function (err, result) {
            if (err != null) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                if (result.affectedRows === 1) {
                    res.sendStatus(200);
                }
                else {
                    res.sendStatus(404);
                }
            }
        });
    }
    else {
        res.sendStatus(400);
    }
});
router.delete("/customer/:id", function (req, res) {
    var id = req.params.id;
    connection.query("SELECT * FROM Customer WHERE id = ?", [id], function (err, results) {
        if (err !== null) {
            console.log(err);
            res.sendStatus(500);
        }
        else {
            if (results.length === 0) {
                res.sendStatus(404);
            }
            else {
                var customer_1 = results[0];
                connection.query("DELETE FROM Customer WHERE id = ?", [id], function (err) {
                    if (err !== null) {
                        console.log(err);
                        res.sendStatus(500);
                    }
                    else {
                        res.status(200);
                        res.json(customer_1);
                    }
                });
            }
        }
    });
});
router.post("/item", function (req, res) {
    var name = req.body.name;
    var quantity = Number(req.body.quantity);
    var basePrice = Number(req.body.basePrice);
    if (name !== undefined && quantity !== undefined && !isNaN(quantity) && quantity >= 0 && basePrice !== undefined && !isNaN(basePrice) && basePrice >= 0.01) {
        connection.query("INSERT INTO Item (name, quantity, basePrice) VALUES (?, ?, ?)", [name, quantity, basePrice], function (err, result) {
            if (err !== null) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                res.status(201);
                res.send("/item/" + result.insertId);
            }
        });
    }
    else {
        res.sendStatus(400);
    }
});
router.get("/item", function (req, res) {
    connection.query("SELECT * FROM Item", [], function (err, result) {
        if (err !== null) {
            console.log(err);
            res.sendStatus(500);
        }
        else {
            res.status(200);
            res.json(result);
        }
    });
});
router.put("/item/:id", function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var quantity = Number(req.body.quantity);
    var basePrice = Number(req.body.basePrice);
    if (name !== undefined && quantity !== undefined && !isNaN(quantity) && quantity >= 0 && basePrice !== undefined && !isNaN(basePrice) && basePrice >= 0.01) {
        connection.query("UPDATE Item SET name = ?, quantity = ?, basePrice = ? WHERE id = ?", [name, quantity, basePrice, id], function (err, result) {
            if (err !== null) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                if (result.affectedRows === 1) {
                    res.sendStatus(200);
                }
                else {
                    res.sendStatus(404);
                }
            }
        });
    }
    else {
        res.sendStatus(400);
    }
});
router.delete("/item/:id", function (req, res) {
    var id = req.params.id;
    connection.query("SELECT * FROM Item WHERE id = ?", [id], function (err, result) {
        if (err !== null) {
            console.log(err);
            res.sendStatus(500);
        }
        else {
            if (result.length === 0) {
                res.sendStatus(404);
            }
            else {
                var item_1 = result[0];
                connection.query("DELETE FROM Item WHERE id = ?", [id], function (err) {
                    if (err !== null) {
                        console.log(err);
                        res.sendStatus(500);
                    }
                    else {
                        res.status(200);
                        res.json(item_1);
                    }
                });
            }
        }
    });
});
router.post("/special-offer/", function (req, res) {
    var item = Number(req.body.item);
    var quantity = Number(req.body.quantity);
    var price = Number(req.body.price);
    var begin = new Date(req.body.begin);
    var expiration = new Date(req.body.expiration);
    if (item !== undefined && !isNaN(item) && quantity !== undefined && !isNaN(quantity) && quantity >= 1 && price !== undefined && !isNaN(price) && price >= 0.01 && new Date(begin) !== undefined && new Date(expiration) !== undefined) {
        connection.query("SELECT * FROM Item WHERE id = ?", [item], function (err, result) {
            if (err !== null) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                if (result.length === 0) {
                    res.status(400);
                    res.send("Error: Invalid item");
                }
                else {
                    var usualPrice = quantity * result[0].basePrice;
                    if (price >= usualPrice) {
                        res.status(400);
                        res.send("Error: Offer too expensive. ");
                    }
                    else {
                        if (expiration < begin) {
                            res.status(400);
                            res.send("Error: Offer expires before it begins");
                        }
                        else {
                            connection.query("INSERT INTO SpecialOffer (item, quantity, price, begin, expiration) VALUES (?, ?, ?, ?, ?)", [item, quantity, price, begin, expiration], function (err1, result1) {
                                if (err1 !== null) {
                                    console.log(err1);
                                    res.sendStatus(500);
                                }
                                else {
                                    res.status(201);
                                    res.send("/special-offer/" + result1.insertId);
                                }
                            });
                        }
                    }
                }
            }
        });
    }
    else {
        res.status(400);
        res.send("Error: Invalid arguments. ");
    }
});
router.get("/special-offer", function (req, res) {
    connection.query("SELECT * FROM SpecialOffer", [], function (err, result) {
        if (err !== null) {
            console.log(err);
            res.sendStatus(500);
        }
        else {
            res.status(200);
            res.json(result);
        }
    });
});
router.put("/special-offer/:id", function (req, res) {
    var id = Number(req.params.id);
    var item = Number(req.body.item);
    var quantity = Number(req.body.quantity);
    var price = Number(req.body.price);
    var begin = new Date(req.body.begin);
    var expiration = new Date(req.body.expiration);
    if (item !== undefined && !isNaN(item) && quantity !== undefined && !isNaN(quantity) && quantity >= 1 && price !== undefined && !isNaN(price) && price >= 0.01 && new Date(begin) !== undefined && new Date(expiration) !== undefined) {
        connection.query("SELECT * FROM Item WHERE id = ?", [item], function (err, result) {
            if (result.length === 0) {
                res.status(400);
                res.send("Error: Invalid item!");
            }
            else {
                var usualPrice = quantity * result[0].basePrice;
                if (usualPrice <= price) {
                    res.status(400);
                    res.send("Error: Offer too expensive. ");
                }
                else {
                    if (expiration < begin) {
                        res.status(400);
                        res.send("Error: Offer expires before it begins");
                    }
                    else {
                        connection.query("UPDATE SpecialOffer SET item = ?, quantity = ?, price = ?, begin = ?, expiration = ? WHERE id = ?", [item, quantity, price, begin, expiration, id], function (err, result) {
                            if (err != null) {
                                console.log(err);
                                res.sendStatus(500);
                            }
                            else {
                                if (result.affectedRows === 1) {
                                    res.sendStatus(200);
                                }
                                else {
                                    res.sendStatus(404);
                                }
                            }
                        });
                    }
                }
            }
        });
    }
    else {
        res.status(400);
        res.send("Error: Invalid arguments. ");
    }
});
router.delete("/special-offer/:id", function (req, res) {
    var id = Number(req.params.id);
    connection.query("SELECT * FROM SpecialOffer WHERE id = ?", [id], function (err, result) {
        if (err !== null) {
            console.log(err);
            res.sendStatus(500);
        }
        else {
            if (result.length !== 1) {
                res.sendStatus(404);
            }
            else {
                var specialOffer_1 = result[0];
                if (specialOffer_1.expiration > new Date()) {
                    res.status(400);
                    res.send("Error: Offer not expired yet. ");
                }
                else {
                    connection.query("DELETE FROM SpecialOffer WHERE id = ?", [id], function (err1) {
                        if (err !== null) {
                            console.log(err);
                            res.sendStatus(500);
                        }
                        else {
                            res.status(200);
                            res.json(specialOffer_1);
                        }
                    });
                }
            }
        }
    });
});
