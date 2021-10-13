"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mysql = require("mysql2");
var session = require("express-session");
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
router.use(session({
    cookie: {
        expires: new Date(Date.now() + (1000 * 60 * 60))
    },
    secret: Math.random().toString(),
    resave: true,
    saveUninitialized: false
}));
router.use("/res", express.static(__dirname + "/public"));
router.use("/dependency", express.static(__dirname + "/node_modules"));
router.get("/login.html", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/views/login.html");
});
router.get("/logout.html", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/views/logout.html");
});
router.post("/login", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username !== undefined && password !== undefined) {
        connection.query("SELECT * FROM accountManager WHERE username = ? AND passwd = ?", [username, password], function (err, result) {
            if (err !== null) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                if (result.length === 0) {
                    res.sendStatus(401);
                }
                else {
                    req.session.loginID = result[0].id;
                    res.sendStatus(200);
                }
            }
        });
    }
    else {
        res.sendStatus(400);
    }
});
router.post("/logout", function (req, res) {
    req.session.destroy(function () {
        res.clearCookie("connect.sid");
        res.sendStatus(200);
    });
});
router.get("/", function (req, res) {
    if (req.session.loginID !== undefined) {
        res.status(200);
        res.sendFile(__dirname + "/views/index.html");
    }
    else {
        res.redirect("login.html");
    }
});
router.get("/index.html", function (req, res) {
    if (req.session.loginID !== undefined) {
        res.status(200);
        res.sendFile(__dirname + "/views/index.html");
    }
    else {
        res.sendStatus(401);
    }
});
router.get("/customer.html", function (req, res) {
    if (req.session.loginID !== undefined) {
        res.status(200);
        res.sendFile(__dirname + "/views/customer.html");
    }
    else {
        res.sendStatus(401);
    }
});
router.get("/item.html", function (req, res) {
    if (req.session.loginID !== undefined) {
        res.status(200);
        res.sendFile(__dirname + "/views/item.html");
    }
    else {
        res.sendStatus(401);
    }
});
router.get("/special-offer.html", function (req, res) {
    if (req.session.loginID !== undefined) {
        res.status(200);
        res.sendFile(__dirname + "/views/special-offer.html");
    }
    else {
        res.sendStatus(401);
    }
});
router.get("/purchase.html", function (req, res) {
    if (req.session.loginID)
        res.status(200);
    res.sendFile(__dirname + "/views/purchase.html");
});
var Customer = /** @class */ (function () {
    function Customer(req) {
        this.lastName = req.body.lastName;
        this.firstName = req.body.firstName;
        this.street = req.body.street;
        this.houseNumber = req.body.houseNumber;
        this.postalCode = req.body.postalCode;
        this.city = req.body.city;
        this.emailAddress = req.body.emailAddress;
        this.phoneNumber = req.body.phoneNumber;
    }
    Customer.prototype.validate = function () {
        return this.lastName !== undefined
            && this.firstName !== undefined
            && this.street !== undefined
            && this.houseNumber !== undefined
            && !isNaN(this.houseNumber)
            && this.postalCode !== undefined
            && !isNaN(this.postalCode)
            && this.city !== undefined
            && this.emailAddress !== undefined
            && this.phoneNumber !== undefined;
    };
    return Customer;
}());
router.post("/customer", function (req, res) {
    if (req.session.loginID !== undefined) {
        var customer = new Customer(req);
        if (customer.validate()) {
            connection.query("INSERT INTO Customer (lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [customer.lastName, customer.firstName, customer.street, customer.houseNumber, customer.postalCode, customer.city, customer.emailAddress, customer.phoneNumber], function (err, result) {
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
    }
    else {
        res.sendStatus(401);
    }
});
router.get("/customer", function (req, res) {
    if (req.session.loginID !== undefined) {
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
    }
    else {
        res.sendStatus(401);
    }
});
router.put("/customer/:id", function (req, res) {
    if (req.session.loginID !== undefined) {
        var id = req.params.id;
        var customer = new Customer(req);
        if (customer.validate()) {
            connection.query("UPDATE Customer SET lastName = ?, firstName = ?, street = ?, houseNumber = ?, postalCode = ?, city = ?, emailAddress = ?, phoneNumber = ? WHERE id = ?", [customer.lastName, customer.firstName, customer.street, customer.houseNumber, customer.postalCode, customer.city, customer.emailAddress, customer.phoneNumber, id], function (err, result) {
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
    }
    else {
        res.sendStatus(401);
    }
});
router.delete("/customer/:id", function (req, res) {
    if (req.session.loginID !== undefined) {
        var id_1 = req.params.id;
        connection.query("SELECT * FROM Customer WHERE id = ?", [id_1], function (err, results) {
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
                    connection.query("DELETE FROM Customer WHERE id = ?", [id_1], function (err) {
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
    }
    else {
        res.sendStatus(401);
    }
});
router.post("/item", function (req, res) {
    if (req.session.loginID !== undefined) {
        var name_1 = req.body.name;
        var quantity = Number(req.body.quantity);
        var basePrice = Number(req.body.basePrice);
        if (name_1 !== undefined && quantity !== undefined && !isNaN(quantity) && quantity >= 0 && basePrice !== undefined && !isNaN(basePrice) && basePrice >= 0.01) {
            connection.query("INSERT INTO Item (name, quantity, basePrice) VALUES (?, ?, ?)", [name_1, quantity, basePrice], function (err, result) {
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
    }
    else {
        res.sendStatus(401);
    }
});
router.get("/item", function (req, res) {
    if (req.session.loginID !== undefined) {
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
    }
    else {
        res.sendStatus(401);
    }
});
router.put("/item/:id", function (req, res) {
    if (req.session.loginID !== undefined) {
        var id = req.params.id;
        var name_2 = req.body.name;
        var quantity = Number(req.body.quantity);
        var basePrice = Number(req.body.basePrice);
        if (name_2 !== undefined && quantity !== undefined && !isNaN(quantity) && quantity >= 0 && basePrice !== undefined && !isNaN(basePrice) && basePrice >= 0.01) {
            connection.query("UPDATE Item SET name = ?, quantity = ?, basePrice = ? WHERE id = ?", [name_2, quantity, basePrice, id], function (err, result) {
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
    }
});
router.delete("/item/:id", function (req, res) {
    if (req.session.loginID !== undefined) {
        var id_2 = req.params.id;
        connection.query("SELECT * FROM Item WHERE id = ?", [id_2], function (err, result) {
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
                    connection.query("DELETE FROM Item WHERE id = ?", [id_2], function (err) {
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
    }
    else {
        res.sendStatus(401);
    }
});
function validateSpecialOffer(item, quantity, price, begin, expiration) {
    return item !== undefined
        && !isNaN(item)
        && quantity !== undefined
        && !isNaN(quantity)
        && quantity >= 1
        && price !== undefined
        && !isNaN(price)
        && price >= 0.01
        && (new Date(begin) !== undefined)
        && (new Date(expiration) !== undefined);
}
router.post("/special-offer/", function (req, res) {
    if (req.session.loginID !== undefined) {
        var item_2 = Number(req.body.item);
        var quantity_1 = Number(req.body.quantity);
        var price_1 = Number(req.body.price);
        var begin_1 = new Date(req.body.begin);
        var expiration_1 = new Date(req.body.expiration);
        if (validateSpecialOffer(item_2, quantity_1, price_1, begin_1, expiration_1)) {
            connection.query("SELECT * FROM Item WHERE id = ?", [item_2], function (err, result) {
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
                        var usualPrice = quantity_1 * result[0].basePrice;
                        if (price_1 >= usualPrice) {
                            res.status(400);
                            res.send("Error: Offer too expensive. ");
                        }
                        else {
                            if (expiration_1 < begin_1) {
                                res.status(400);
                                res.send("Error: Offer expires before it begins");
                            }
                            else {
                                connection.query("INSERT INTO SpecialOffer (item, quantity, price, begin, expiration) VALUES (?, ?, ?, ?, ?)", [item_2, quantity_1, price_1, begin_1, expiration_1], function (err1, result1) {
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
    }
    else {
        res.sendStatus(401);
    }
});
router.get("/special-offer", function (req, res) {
    if (req.session.loginID !== undefined) {
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
    }
    else {
        res.sendStatus(401);
    }
});
router.put("/special-offer/:id", function (req, res) {
    if (req.session.loginID !== undefined) {
        var id_3 = Number(req.params.id);
        var item_3 = Number(req.body.item);
        var quantity_2 = Number(req.body.quantity);
        var price_2 = Number(req.body.price);
        var begin_2 = new Date(req.body.begin);
        var expiration_2 = new Date(req.body.expiration);
        if (validateSpecialOffer(item_3, quantity_2, price_2, begin_2, expiration_2)) {
            connection.query("SELECT * FROM Item WHERE id = ?", [item_3], function (err, result) {
                if (result.length === 0) {
                    res.status(400);
                    res.send("Error: Invalid item!");
                }
                else {
                    var usualPrice = quantity_2 * result[0].basePrice;
                    if (usualPrice <= price_2) {
                        res.status(400);
                        res.send("Error: Offer too expensive. ");
                    }
                    else {
                        if (expiration_2 < begin_2) {
                            res.status(400);
                            res.send("Error: Offer expires before it begins");
                        }
                        else {
                            connection.query("UPDATE SpecialOffer SET item = ?, quantity = ?, price = ?, begin = ?, expiration = ? WHERE id = ?", [item_3, quantity_2, price_2, begin_2, expiration_2, id_3], function (err, result) {
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
    }
    else {
        res.sendStatus(401);
    }
});
router.delete("/special-offer/:id", function (req, res) {
    if (req.session.loginID !== undefined) {
        var id_4 = Number(req.params.id);
        connection.query("SELECT * FROM SpecialOffer WHERE id = ?", [id_4], function (err, result) {
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
                        connection.query("DELETE FROM SpecialOffer WHERE id = ?", [id_4], function () {
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
    }
    else {
        res.sendStatus(401);
    }
});
router.post("/purchase", function (req, res) {
    if (req.session.loginID !== undefined) {
        var customer_2 = Number(req.body.customer);
        var item_4 = Number(req.body.item);
        var quantity_3 = Number(req.body.quantity);
        var date_1 = new Date(req.body.date);
        if (customer_2 !== undefined && !isNaN(customer_2) && item_4 !== undefined && !isNaN(item_4) && quantity_3 !== undefined && !isNaN(quantity_3) && quantity_3 > 0 && date_1 !== undefined && date_1 <= new Date()) {
            connection.query("SELECT * FROM Customer WHERE id = ?", [customer_2], function (err, result) {
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
                        connection.query("SELECT * FROM Item WHERE Id = ?", [item_4], function (err, result) {
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
                                    if (quantity_3 > result[0].quantity) {
                                        res.status(400);
                                        res.send("Error: Not enough pieces available. ");
                                    }
                                    else {
                                        connection.query("UPDATE Item SET quantity = ? WHERE id = ?", [result[0].quantity - quantity_3, item_4], function (err) {
                                            if (err !== null) {
                                                console.log(err);
                                                res.sendStatus(500);
                                            }
                                            else {
                                                connection.query("INSERT INTO Purchase (customer, item, quantity, date) VALUES (?, ?, ?, ?)", [customer_2, item_4, quantity_3, date_1], function (err, result) {
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
    }
    else {
        res.sendStatus(401);
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
    if (req.session.loginID !== undefined) {
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
    }
    else {
        res.sendStatus(401);
    }
});
router.put("/purchase/:id", function (req, res) {
    if (req.session.loginID !== undefined) {
        var id_5 = Number(req.params.id);
        var customer_3 = Number(req.body.customer);
        var item_5 = Number(req.body.item);
        var quantity_4 = Number(req.body.quantity);
        var date_2 = new Date(req.body.date);
        if (customer_3 !== undefined && !isNaN(customer_3) && item_5 !== undefined && !isNaN(item_5) && quantity_4 !== undefined && !isNaN(quantity_4) && quantity_4 > 0 && date_2 !== undefined && date_2 <= new Date()) {
            connection.query("SELECT * FROM Customer WHERE id = ?", [customer_3], function (err, result) {
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
                        connection.query("SELECT * FROM Item WHERE id = ?", [item_5], function (err, result) {
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
                                    connection.query("SELECT * FROM Purchase WHERE id = ?", [id_5], function (err, result1) {
                                        if (err !== null) {
                                            console.log(err);
                                            res.sendStatus(500);
                                        }
                                        else {
                                            if (result1.length !== 1) {
                                                res.sendStatus(404);
                                            }
                                            else {
                                                var newQuantity_1 = item_5 == result1[0].item ? result[0].quantity + result1[0].quantity - quantity_4 : result[0].quantity - quantity_4;
                                                if (newQuantity_1 < 0) {
                                                    res.status(400);
                                                    res.send("Error: not enough pieces available");
                                                }
                                                else {
                                                    connection.query("UPDATE Purchase SET customer = ?, item = ?, quantity = ?, date = ? WHERE id = ?", [customer_3, item_5, quantity_4, date_2, id_5], function (err) {
                                                        if (err !== null) {
                                                            console.log(err);
                                                            res.sendStatus(500);
                                                        }
                                                        else {
                                                            connection.query("UPDATE Item SET quantity = ? WHERE id = ?", [newQuantity_1, item_5], function (err) {
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
    }
    else {
        res.sendStatus(401);
    }
});
router.delete("/purchase/:id", function (req, res) {
    if (req.session.loginID !== undefined) {
        var id_6 = Number(req.params.id);
        connection.query("SELECT * FROM Purchase WHERE id = ?", [id_6], function (err, result) {
            if (err !== null) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                if (result.length !== 1) {
                    res.sendStatus(404);
                }
                else {
                    connection.query("DELETE FROM Purchase WHERE id = ?", [id_6], function (err) {
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
    }
    else {
        res.sendStatus(401);
    }
});
