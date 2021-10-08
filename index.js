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
router.use("/res", express.static(__dirname + "/public"));
router.use("/dependency", express.static(__dirname + "/node_modules"));
router.get("/", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/views/index.html");
});
router.get("/index.html", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/views/index.html");
});
router.get("/customer.html", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/views/customer.html");
});
router.get("/item.html", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/views/item.html");
});
router.get("/special-offer.html", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/views/special-offer.html");
});
router.get("/purchase.html", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/views/purchase.html");
});
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
                res.status(400);
                res.send("Error: Customer has purchases. ");
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
        res.status(400);
        res.send("Error: Invalid arguments. ");
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
                        res.sendStatus(400);
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
                res.status(400);
                res.send("Error: Item is purchased. ");
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
        res.status(400);
        res.send("Error: Invalid arguments. ");
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
                        res.sendStatus(400);
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
            result.forEach(function (specialOffer) {
                specialOffer.begin.setDate(specialOffer.begin.getDate() + 1);
                specialOffer.expiration.setDate(specialOffer.expiration.getDate() + 1);
            });
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
router.post("/purchase", function (req, res) {
    var customer = Number(req.body.customer);
    var item = Number(req.body.item);
    var quantity = Number(req.body.quantity);
    var date = new Date(req.body.date);
    if (customer !== undefined && !isNaN(customer) && item !== undefined && !isNaN(item) && quantity !== undefined && !isNaN(quantity) && quantity > 0 && date !== undefined && date <= new Date()) {
        connection.query("SELECT * FROM Customer WHERE id = ?", [customer], function (err, result) {
            if (err !== null) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                if (result.length !== 1) {
                    res.status(400);
                    res.send("Error: Customer not found.");
                }
                else {
                    connection.query("SELECT * FROM Item WHERE Id = ?", [item], function (err, result) {
                        if (err !== null) {
                            console.log(err);
                            res.sendStatus(500);
                        }
                        else {
                            if (result.length !== 1) {
                                res.status(400);
                                res.send("Error: Item not found.");
                            }
                            else {
                                if (quantity > result[0].quantity) {
                                    res.status(400);
                                    res.send("Error: Not enough pieces available. ");
                                }
                                else {
                                    connection.query("UPDATE Item SET quantity = ? WHERE id = ?", [result[0].quantity - quantity, item], function (err) {
                                        if (err !== null) {
                                            console.log(err);
                                            res.sendStatus(500);
                                        }
                                        else {
                                            connection.query("INSERT INTO Purchase (customer, item, quantity, date) VALUES (?, ?, ?, ?)", [customer, item, quantity, date], function (err, result) {
                                                if (err !== null) {
                                                    console.log(err);
                                                    res.sendStatus(500);
                                                }
                                                else {
                                                    res.status(201);
                                                    res.send("/purchase/" + result.insertId);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    }
    else {
        res.status(400);
        res.send("Error: Invalid Arguments");
    }
});
function purchasePrice(purchase, specialOffers, items) {
    var remainingQuantity = purchase.quantity;
    var item = items.find(function (value) { return value.id == purchase.item; });
    var possibleSpecialOffers = specialOffers.filter(function (value) { return value.item == purchase.item && value.begin <= purchase.date && value.expiration >= purchase.date; });
    purchase.price = 0;
    var _loop_1 = function () {
        var remainingSpecialOffers = possibleSpecialOffers.filter(function (value) { return value.quantity <= remainingQuantity; });
        if (remainingSpecialOffers.length === 0) {
            purchase.price += Number(remainingQuantity * item.basePrice);
            remainingQuantity = 0;
        }
        else {
            var maxQuantity_1 = Math.max.apply(Math, remainingSpecialOffers.map(function (value) { return value.quantity; }));
            var specialOffer = remainingSpecialOffers.find(function (value) { return value.quantity = maxQuantity_1; });
            purchase.price += Number(specialOffer.price);
            remainingQuantity -= maxQuantity_1;
        }
    };
    while (remainingQuantity > 0) {
        _loop_1();
    }
}
router.get("/purchase", function (req, res) {
    connection.query("SELECT * FROM Purchase", [], function (err, purchases) {
        if (err !== null) {
            console.log(err);
            res.sendStatus(500);
        }
        else {
            connection.query("SELECT * FROM SpecialOffer", [], function (err, specialOffers) {
                if (err !== null) {
                    console.log(err);
                    res.sendStatus(500);
                }
                else {
                    connection.query("SELECT * FROM Item", [], function (err, items) {
                        if (err !== null) {
                            console.log(err);
                            res.sendStatus(500);
                        }
                        else {
                            purchases.forEach(function (value) {
                                //for some reason, the dates are decremented in SQL-Select. Therefore, I have to increment it again.
                                value.date.setDate(value.date.getDate() + 1);
                                purchasePrice(value, specialOffers, items);
                            });
                            res.status(200);
                            res.json(purchases);
                        }
                    });
                }
            });
        }
    });
});
router.put("/purchase/:id", function (req, res) {
    var id = Number(req.params.id);
    var customer = Number(req.body.customer);
    var item = Number(req.body.item);
    var quantity = Number(req.body.quantity);
    var date = new Date(req.body.date);
    if (customer !== undefined && !isNaN(customer) && item !== undefined && !isNaN(item) && quantity !== undefined && !isNaN(quantity) && quantity > 0 && date !== undefined && date <= new Date()) {
        connection.query("SELECT * FROM Customer WHERE id = ?", [customer], function (err, result) {
            if (err !== null) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                if (result.length !== 1) {
                    res.status(400);
                    res.send("Error: customer not found");
                }
                else {
                    connection.query("SELECT * FROM Item WHERE id = ?", [item], function (err, result) {
                        if (err !== null) {
                            console.log(err);
                            res.sendStatus(500);
                        }
                        else {
                            if (result.length !== 1) {
                                res.status(400);
                                res.send("Error: Item not found!");
                            }
                            else {
                                connection.query("SELECT * FROM Purchase WHERE id = ?", [id], function (err, result1) {
                                    if (err !== null) {
                                        console.log(err);
                                        res.sendStatus(500);
                                    }
                                    else {
                                        if (result1.length !== 1) {
                                            res.sendStatus(404);
                                        }
                                        else {
                                            var newQuantity_1 = item == result1[0].item ? result[0].quantity + result1[0].quantity - quantity : result[0].quantity - quantity;
                                            if (newQuantity_1 < 0) {
                                                res.status(400);
                                                res.send("Error: not enough pieces available");
                                            }
                                            else {
                                                connection.query("UPDATE Purchase SET customer = ?, item = ?, quantity = ?, date = ? WHERE id = ?", [customer, item, quantity, date, id], function (err) {
                                                    if (err !== null) {
                                                        console.log(err);
                                                        res.sendStatus(500);
                                                    }
                                                    else {
                                                        connection.query("UPDATE Item SET quantity = ? WHERE id = ?", [newQuantity_1, item], function (err) {
                                                            if (err !== null) {
                                                                console.log(err);
                                                                res.sendStatus(500);
                                                            }
                                                            else {
                                                                res.sendStatus(200);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    else {
        res.status(400);
        res.send("Error: Invalid arguments");
    }
});
router.delete("/purchase/:id", function (req, res) {
    var id = Number(req.params.id);
    connection.query("SELECT * FROM Purchase WHERE id = ?", [id], function (err, result) {
        if (err !== null) {
            console.log(err);
            res.sendStatus(500);
        }
        else {
            if (result.length !== 1) {
                res.sendStatus(404);
            }
            else {
                connection.query("DELETE FROM Purchase WHERE id = ?", [id], function (err) {
                    if (err !== null) {
                        console.log(err);
                        res.sendStatus(500);
                    }
                    else {
                        res.status(200);
                        res.json(result[0]);
                    }
                });
            }
        }
    });
});
