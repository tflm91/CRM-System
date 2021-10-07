import * as express from "express";
import * as mysql from "mysql2";
import {QueryError, ResultSetHeader, RowDataPacket} from "mysql2";

const connection : mysql.Connection = mysql.createConnection({
    database: "CRMSystemDB",
    host: "localhost",
    user: "root"
});

connection.connect((err) => {
    if(err != null) {
        console.log("DB-Error: " + err);
    }
})

const router: express.Express = express();
router.listen(8080);
router.use(express.urlencoded({extended: false}));
router.use(express.json());

router.use("/res", express.static(__dirname + "/public"));
router.use("/dependency", express.static(__dirname + "/node_modules"));

router.get("/", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/views/index.html");
})

router.get("/index.html", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/views/index.html");
})

router.get("/customer.html", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/views/customer.html");
})

router.get("/item.html", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/views/item.html");
})

router.get("/special-offer.html", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/views/special-offer.html");
})

router.get("/purchase.html", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/views/purchase.html");
})

interface ICustomer extends RowDataPacket {
    id: number,
    lastName: string;
    firstName: string;
    street: string,
    houseNumber: number,
    postalCode: number,
    city: string,
    emailAddress: string,
    phoneNumber: string
}

router.post("/customer", (req: express.Request, res: express.Response) => {
    const lastName: string = req.body.lastName;
    const firstName: string = req.body.firstName;
    const street: string = req.body.street;
    const houseNumber: number = Number(req.body.houseNumber);
    const postalCode: number = Number(req.body.postalCode);
    const city: string = req.body.city;
    const emailAddress: string = req.body.emailAddress;
    const phoneNumber: string = req.body.phoneNumber;

    if(lastName !== undefined && firstName !== undefined && street !== undefined && houseNumber !== undefined && !isNaN(houseNumber) && postalCode !== undefined && !isNaN(postalCode) && city !== undefined && emailAddress !== undefined && phoneNumber !== undefined) {
        connection.query("INSERT INTO Customer (lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber], (err: QueryError | null, result: ResultSetHeader) => {
                if(err != null) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.status(201);
                    res.send("/customer/" + result.insertId);
                }
            })
    } else {
        res.sendStatus(400);
    }
})

router.get("/customer", (req: express.Request, res: express.Response) => {
    connection.query("SELECT * FROM Customer", [], (err, result:ICustomer[]) => {
        if(err != null) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.status(200);
            res.json(result);
        }
    })
})

router.put("/customer/:id", (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;
    const lastName: string = req.body.lastName;
    const firstName: string = req.body.firstName;
    const street: string = req.body.street;
    const houseNumber: number = Number(req.body.houseNumber);
    const postalCode: number = Number(req.body.postalCode);
    const city: string = req.body.city;
    const emailAddress: string = req.body.emailAddress;
    const phoneNumber: string = req.body.phoneNumber;

    if(lastName !== undefined && firstName !== undefined && street !== undefined && houseNumber !== undefined && !isNaN(houseNumber) && postalCode !== undefined && !isNaN(postalCode) && city !== undefined && emailAddress !== undefined && phoneNumber !== undefined) {
        connection.query("UPDATE Customer SET lastName = ?, firstName = ?, street = ?, houseNumber = ?, postalCode = ?, city = ?, emailAddress = ?, phoneNumber = ? WHERE id = ?",
            [lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber, id], (err, result:ResultSetHeader) => {
                if(err != null) {
                    console.log(err);
                    res.status(400);
                    res.send("Error: Customer has purchases. ");
                } else {
                    if(result.affectedRows === 1) {
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(404);
                    }
                }
            })
    } else {
        res.status(400);
        res.send("Error: Invalid arguments. ");
    }
})

router.delete("/customer/:id", (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;
    connection.query("SELECT * FROM Customer WHERE id = ?", [id], (err, results: ICustomer[]) => {
        if(err !== null) {
            console.log(err);
            res.sendStatus(500);
        } else {
            if(results.length === 0) {
                res.sendStatus(404);
            } else {
                const customer: ICustomer = results[0];
                connection.query("DELETE FROM Customer WHERE id = ?", [id], (err) => {
                    if(err !== null) {
                        console.log(err);
                        res.sendStatus(400);
                    } else {
                        res.status(200);
                        res.json(customer);
                    }
                })
            }
        }
    })
})

interface IItem extends RowDataPacket {
    id: number,
    name: string,
    quantity: number,
    basePrice: number
}

router.post("/item", (req: express.Request, res: express.Response) => {
    const name: string = req.body.name;
    const quantity: number = Number(req.body.quantity);
    const basePrice: number = Number(req.body.basePrice);

    if(name !== undefined && quantity !== undefined && !isNaN(quantity) && quantity >= 0 && basePrice !== undefined && !isNaN(basePrice) && basePrice >= 0.01) {
        connection.query("INSERT INTO Item (name, quantity, basePrice) VALUES (?, ?, ?)",
            [name, quantity, basePrice], (err, result:ResultSetHeader) => {
            if(err !== null) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.status(201);
                res.send("/item/" + result.insertId);
            }
            })
    } else {
        res.sendStatus(400);
    }
})

router.get("/item", (req: express.Request, res: express.Response) => {
    connection.query("SELECT * FROM Item", [], (err, result: IItem[]) => {
        if(err !== null) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.status(200);
            res.json(result);
        }
    })
})

router.put("/item/:id", (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;
    const name: string = req.body.name;
    const quantity: number = Number(req.body.quantity);
    const basePrice: number = Number(req.body.basePrice);

    if(name !== undefined && quantity !== undefined && !isNaN(quantity) && quantity >= 0 && basePrice !== undefined && !isNaN(basePrice) && basePrice >= 0.01) {
        connection.query("UPDATE Item SET name = ?, quantity = ?, basePrice = ? WHERE id = ?",
            [name, quantity, basePrice, id], (err, result:ResultSetHeader) => {
            if(err !== null) {
                console.log(err);
                res.status(400);
                res.send("Error: Item is purchased. ");
            } else {
                if(result.affectedRows === 1) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(404);
                }
            }
            })
    } else {
        res.status(400);
        res.send("Error: Invalid arguments. ");
    }
})

router.delete("/item/:id", (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;
    connection.query("SELECT * FROM Item WHERE id = ?", [id], (err, result:IItem[]) => {
        if(err !== null) {
            console.log(err);
            res.sendStatus(500);
        } else {
            if(result.length === 0) {
                res.sendStatus(404);
            } else {
                const item: IItem = result[0];
                connection.query("DELETE FROM Item WHERE id = ?", [id], (err) => {
                    if(err !== null) {
                        console.log(err);
                        res.sendStatus(400);
                    } else {
                        res.status(200);
                        res.json(item);
                    }
                })
            }
        }
    })
})

interface ISpecialOffer extends RowDataPacket {
    id: number,
    item: number,
    quantity: number,
    price: number,
    begin: Date,
    expiration: Date
}

router.post("/special-offer/", (req: express.Request, res: express.Response) => {
    const item: number = Number(req.body.item);
    const quantity: number = Number(req.body.quantity);
    const price: number = Number(req.body.price);
    const begin: Date = new Date(req.body.begin);
    const expiration: Date = new Date(req.body.expiration);

    if(item !== undefined && !isNaN(item) && quantity !== undefined && !isNaN(quantity) && quantity >= 1 && price !== undefined && !isNaN(price) && price >= 0.01 && new Date(begin) !== undefined && new Date(expiration) !== undefined) {
        connection.query("SELECT * FROM Item WHERE id = ?", [item], (err, result: IItem[]) => {
            if(err !== null) {
                console.log(err);
                res.sendStatus(500);
            } else {
                if(result.length === 0) {
                    res.status(400);
                    res.send("Error: Invalid item");
                } else {
                    const usualPrice: number = quantity * result[0].basePrice;
                    if(price >= usualPrice) {
                        res.status(400);
                        res.send("Error: Offer too expensive. ");
                    } else {
                        if(expiration < begin) {
                            res.status(400);
                            res.send("Error: Offer expires before it begins");
                        } else {
                            connection.query("INSERT INTO SpecialOffer (item, quantity, price, begin, expiration) VALUES (?, ?, ?, ?, ?)", [item, quantity, price, begin, expiration], (err1, result1:ResultSetHeader) => {
                                if(err1 !== null) {
                                    console.log(err1);
                                    res.sendStatus(500);
                                } else {
                                    res.status(201);
                                    res.send("/special-offer/" + result1.insertId);
                                }
                            })
                        }
                    }
                }
            }
        })
    } else {
        res.status(400);
        res.send("Error: Invalid arguments. ")
    }
})

router.get("/special-offer", (req: express.Request, res: express.Response) => {
    connection.query("SELECT * FROM SpecialOffer", [], (err, result:ISpecialOffer[]) => {
        if(err !== null) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.status(200);
            result.forEach(specialOffer => { //for some reason, the dates are decremented in SQL-Select. Therefore, I have to increment it again.
                specialOffer.begin.setDate(specialOffer.begin.getDate() + 1);
                specialOffer.expiration.setDate(specialOffer.expiration.getDate() + 1);
            })
            res.json(result);
        }
    })
})

router.put("/special-offer/:id", (req: express.Request, res: express.Response) => {
    const id: number = Number(req.params.id);
    const item: number = Number(req.body.item);
    const quantity: number = Number(req.body.quantity);
    const price: number = Number(req.body.price);
    const begin: Date = new Date(req.body.begin);
    const expiration: Date = new Date(req.body.expiration);

    if(item !== undefined && !isNaN(item) && quantity !== undefined && !isNaN(quantity) && quantity >= 1 && price !== undefined && !isNaN(price) && price >= 0.01 && new Date(begin) !== undefined && new Date(expiration) !== undefined) {
        connection.query("SELECT * FROM Item WHERE id = ?", [item], (err, result: IItem[]) => {
            if(result.length === 0) {
                res.status(400);
                res.send("Error: Invalid item!");
            } else {
                const usualPrice: number = quantity *result[0].basePrice;
                if(usualPrice <= price) {
                    res.status(400);
                    res.send("Error: Offer too expensive. ");
                } else {
                    if(expiration < begin) {
                        res.status(400);
                        res.send("Error: Offer expires before it begins");
                    } else {
                        connection.query("UPDATE SpecialOffer SET item = ?, quantity = ?, price = ?, begin = ?, expiration = ? WHERE id = ?", [item, quantity, price, begin, expiration, id], (err, result: ResultSetHeader) => {
                            if(err != null) {
                                console.log(err);
                                res.sendStatus(500);
                            } else {
                                if(result.affectedRows === 1) {
                                    res.sendStatus(200);
                                } else {
                                    res.sendStatus(404);
                                }
                            }
                            }
                        )
                    }
                }
            }
        })
    } else {
        res.status(400);
        res.send("Error: Invalid arguments. ")
    }
})

router.delete("/special-offer/:id", (req: express.Request, res: express.Response) => {
    const id: number = Number(req.params.id);
    connection.query("SELECT * FROM SpecialOffer WHERE id = ?", [id], (err, result:ISpecialOffer[]) => {
        if(err !== null) {
            console.log(err);
            res.sendStatus(500);
        } else {
            if(result.length !== 1) {
                res.sendStatus(404);
            } else {
                const specialOffer: ISpecialOffer = result[0];
                if(specialOffer.expiration > new Date()) {
                    res.status(400);
                    res.send("Error: Offer not expired yet. ");
                } else {
                    connection.query("DELETE FROM SpecialOffer WHERE id = ?", [id], (err1) => {
                        if (err !== null) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            res.status(200);
                            res.json(specialOffer);
                        }
                    })
                }
            }
        }
    })
})

interface IPurchase extends RowDataPacket {
    id: number;
    customer: number;
    item: number;
    quantity: number;
    date: Date;
    price: number;
}

router.post("/purchase", (req: express.Request, res: express.Response) => {
    const customer: number = Number(req.body.customer);
    const item: number = Number(req.body.item);
    const quantity: number = Number(req.body.quantity);
    const date: Date = new Date(req.body.date);

    if(customer !== undefined && !isNaN(customer) && item !== undefined && !isNaN(item) && quantity !== undefined && !isNaN(quantity) && quantity > 0 && date !== undefined && date <= new Date()) {
        connection.query("SELECT * FROM Customer WHERE id = ?", [customer], (err, result: ICustomer[]) => {
            if(err !== null) {
                console.log(err);
                res.sendStatus(500);
            } else {
                if(result.length !== 1) {
                    res.status(400);
                    res.send("Error: Customer not found.");
                } else {
                    connection.query("SELECT * FROM Item WHERE Id = ?", [item], (err, result:IItem[]) => {
                        if(err !== null) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            if(result.length !== 1) {
                                res.status(400);
                                res.send("Error: Item not found.");
                            } else {
                                if(quantity > result[0].quantity) {
                                    res.status(400);
                                    res.send("Error: Not enough pieces available. ");
                                } else {
                                    connection.query("UPDATE Item SET quantity = ? WHERE id = ?", [result[0].quantity - quantity, item], (err) => {
                                        if(err !== null) {
                                            console.log(err);
                                            res.sendStatus(500);
                                        } else {
                                            connection.query("INSERT INTO Purchase (customer, item, quantity, date) VALUES (?, ?, ?, ?)", [customer, item, quantity, date], (err, result:ResultSetHeader) => {
                                                if(err !== null) {
                                                    console.log(err);
                                                    res.sendStatus(500);
                                                } else {
                                                    res.status(201);
                                                    res.send("/purchase/" + result.insertId);
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
    } else {
        res.status(400);
        res.send("Error: Invalid Arguments");
    }
})

function purchasePrice(purchase: IPurchase, specialOffers: ISpecialOffer[], items: IItem[]): void {
    let remainingQuantity: number = purchase.quantity;
    const item: IItem = items.find(value => value.id == purchase.item);
    const possibleSpecialOffers: ISpecialOffer[] = specialOffers.filter(value => value.item == purchase.item && value.begin <= purchase.date && value.expiration >= purchase.date);
    purchase.price = 0;
    while(remainingQuantity > 0) {
        const remainingSpecialOffers: ISpecialOffer[] = possibleSpecialOffers.filter(value => value.quantity <= remainingQuantity);
        if(remainingSpecialOffers.length === 0) {
            purchase.price += Number(remainingQuantity *item.basePrice);
            remainingQuantity = 0;
        } else {
            const maxQuantity: number = Math.max(...remainingSpecialOffers.map(value => value.quantity));
            const specialOffer: ISpecialOffer = remainingSpecialOffers.find(value => value.quantity = maxQuantity);
            purchase.price += Number(specialOffer.price);
            remainingQuantity -= maxQuantity;
        }
    }
}

router.get("/purchase", (req: express.Request, res: express.Response) => {
    connection.query("SELECT * FROM Purchase", [], (err, purchases: IPurchase[]) => {
        if(err !== null) {
            console.log(err);
            res.sendStatus(500);
        } else {
            connection.query("SELECT * FROM SpecialOffer", [], (err, specialOffers: ISpecialOffer[]) => {
                if(err !== null) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    connection.query("SELECT * FROM Item", [], (err, items: IItem[]) => {
                        if(err !== null) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            purchases.forEach((value: IPurchase) => {
                                purchasePrice(value, specialOffers, items);
                            })
                            res.status(200);
                            res.json(purchases);
                        }
                    })
                }
            })
        }
    })
})

router.put("/purchase/:id", (req: express.Request, res: express.Response) => {
    const id: number = Number(req.params.id);
    const customer: number = Number(req.body.customer);
    const item: number = Number(req.body.item);
    const quantity: number = Number(req.body.quantity);
    const date: Date = new Date(req.body.date);

    if(customer !== undefined && !isNaN(customer) && item !== undefined && !isNaN(item) && quantity !== undefined && !isNaN(quantity) && quantity > 0 && date !== undefined && date <= new Date()) {
        connection.query("SELECT * FROM Customer WHERE id = ?", [customer], (err, result:ICustomer[]) => {
            if(err !== null) {
                console.log(err);
                res.sendStatus(500);
            } else {
                if(result.length !== 1) {
                    res.status(400);
                    res.send("Error: customer not found");
                } else {
                    connection.query("SELECT * FROM Item WHERE id = ?", [item], (err, result:IItem[]) => {
                        if(err !== null) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            if(result.length !== 1) {
                                res.status(400);
                                res.send("Error: Item not found!");
                            } else {
                                connection.query("SELECT * FROM Purchase WHERE id = ?", [id], (err, result1: IPurchase[]) => {
                                    if(err !== null) {
                                        console.log(err);
                                        res.sendStatus(500);
                                    } else {
                                        if (result1.length !== 1) {
                                            res.sendStatus(404);
                                        } else {
                                            const newQuantity: number = item == result1[0].item ? result[0].quantity + result1[0].quantity - quantity : result[0].quantity - quantity;
                                            if(newQuantity < 0) {
                                                res.status(400);
                                                res.send("Error: not enough pieces available");
                                            } else {
                                                connection.query("UPDATE Purchase SET customer = ?, item = ?, quantity = ?, date = ? WHERE id = ?",
                                                    [customer, item, quantity, date, id], (err) => {
                                                    if(err !== null) {
                                                        console.log(err);
                                                        res.sendStatus(500);
                                                    } else {
                                                        connection.query("UPDATE Item SET quantity = ? WHERE id = ?", [newQuantity, item], (err) => {
                                                            if(err !== null) {
                                                                console.log(err);
                                                                res.sendStatus(500);
                                                            } else {
                                                                res.sendStatus(200);
                                                            }
                                                        })
                                                    }
                                                    })
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    } else {
        res.status(400);
        res.send("Error: Invalid arguments");
    }
})

router.delete("/purchase/:id", (req: express.Request, res: express.Response) => {
    const id: number = Number(req.params.id);
    connection.query("SELECT * FROM Purchase WHERE id = ?", [id], (err, result:IPurchase[]) => {
        if(err !== null) {
            console.log(err);
            res.sendStatus(500);
        } else {
            if(result.length !== 1) {
                res.sendStatus(404);
            } else {
                connection.query("DELETE FROM Purchase WHERE id = ?", [id], (err) => {
                    if(err !== null) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.status(200);
                        res.json(result[0]);
                    }
                })
            }
        }
    })
})
