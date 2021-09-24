import * as express from "express";
import * as mysql from "mysql";

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

function query(sql: string, param: any[] = []): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
        connection.query(sql, param, (err: mysql.MysqlError | null, results: any) => {
            if(err === null) {
                resolve(results);
            } else {
                reject(err);
            }
        })
    })
}

const router: express.Express = express();
router.listen(8080);
router.use(express.urlencoded({extended: false}));
router.use(express.json());

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
        query("INSERT INTO Customer (lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber]).then(() => {
                let id: number;
                query("SELECT MAX(id) AS resId FROM Customer").then((results: any) => {
                    id = Number(results[0].resId);
                    res.status(201);
                    res.send("/customer/" + id);
                }).catch((reason: any) => {
                    console.log(reason);
                    res.sendStatus(500);
                })
        }).catch((reason: any) => {
            console.log(reason);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(400);
    }
})

router.get("/customer", (req: express.Request, res: express.Response) => {
    query("SELECT * FROM Customer").then((results: any) => {
        res.status(200);
        res.json(results);
    }).catch((reason: any) => {
        console.log("reason");
        res.sendStatus(500);
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
        query("UPDATE Customer SET lastName = ?, firstName = ?, street = ?, houseNumber = ?, postalCode = ?, city = ?, emailAddress = ?, phoneNumber = ? WHERE id = ?",
            [lastName, firstName, street, houseNumber, postalCode, city, emailAddress, phoneNumber, id]).then((results: any) => {
                if(results.affectedRows === 1) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(404);
                }
        }).catch((reason: any) => {
            console.log(reason);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(400);
    }
})

router.delete("/customer/:id", (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;
    query("SELECT * FROM Customer WHERE id = ?", [id]).then((results: any) => {
        if(results.length == 1) {
            query("DELETE FROM Customer WHERE id = ?", [id]).then(() => {
                res.status(200);
                res.json(results[0]);
            }).catch((reason: any) => {
                console.log(reason);
                res.sendStatus(400);
            })
        } else {
            res.sendStatus(404);
        }
    }).catch((reason: any) => {
        console.log(reason);
        res.sendStatus(500);
    })
})

router.post("/item", (req: express.Request, res: express.Response) => {
    const name: string = req.body.name;
    const quantity: number = Number(req.body.quantity);
    const basePrice: number = Number(req.body.basePrice);

    if(name !== undefined && quantity !== undefined && !isNaN(quantity) && basePrice !== undefined && !isNaN(basePrice)) {
        query("INSERT INTO Item (name, quantity, basePrice) VALUES (?, ?, ?)",
            [name, quantity, basePrice]).then(() => {
            let id: number;
            query("SELECT MAX(id) AS resId FROM Item").then((results: any) => {
                id = Number(results[0].resId);
                res.status(201);
                res.send("/item/" + id);
            }).catch((reason: any) => {
                console.log(reason);
                res.sendStatus(500);
            })
        }).catch((reason: any) => {
            console.log(reason);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(400);
    }
})

router.get("/item", (req: express.Request, res: express.Response) => {
    query("SELECT * FROM Item").then((results: any) => {
        res.status(200);
        res.json(results);
    }).catch((reason: any) => {
        console.log("reason");
        res.sendStatus(500);
    })
})

router.put("/item/:id", (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;
    const name: string = req.body.name;
    const quantity: number = Number(req.body.quantity);
    const basePrice: number = Number(req.body.basePrice);

    if(name !== undefined && quantity !== undefined && !isNaN(quantity) && basePrice !== undefined && !isNaN(basePrice)) {
        query("UPDATE Item SET name = ?, quantity = ?, basePrice = ? WHERE id = ?",
            [name, quantity, basePrice, id]).then((results: any) => {
            if(results.affectedRows === 1) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        }).catch((reason: any) => {
            console.log(reason);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(400);
    }
})

router.delete("/item/:id", (req: express.Request, res: express.Response) => {
    const id: string = req.params.id;
    query("SELECT * FROM Item WHERE id = ?", [id]).then((results: any) => {
        if(results.length == 1) {
            query("DELETE FROM Item WHERE id = ?", [id]).then(() => {
                res.status(200);
                res.json(results[0]);
            }).catch((reason: any) => {
                console.log(reason);
                res.sendStatus(400);
            })
        } else {
            res.sendStatus(404);
        }
    }).catch((reason: any) => {
        console.log(reason);
        res.sendStatus(500);
    })
})

router.post("/special-offer/", (req: express.Request, res: express.Response) => {
    const item: number = Number(req.body.item);
    const quantity: number = Number(req.body.quantity);
    const price: number = Number(req.body.price);
    const begin: string = req.body.begin;
    const expiration: string = req.body.expiration;

    if(item !== undefined && !isNaN(item) && quantity !== undefined && !isNaN(quantity) && price !== undefined && !isNaN(price) && new Date(begin) !== undefined && new Date(expiration) !== undefined) {
        query("SELECT (? * basePrice) AS usualPrice FROM Item WHERE id = ?",
            [quantity, item]).then((results: any) => {
                if(results.length == 1) {
                    const usualPrice: number = Number(results[0].usualPrice);
                    if(price < usualPrice) {
                        if(new Date(begin) <= new Date(expiration)) {
                            query("INSERT INTO SpecialOffer (item, quantity, price, begin, expiration) VALUES (?, ?, ?, ?, ?)",
                                [item, quantity, price, begin, expiration]).then(() => {
                                query("SELECT MAX(id) AS resId FROM SpecialOffer").then((results: any) => {
                                    const resId: number = Number(results[0].resId);
                                    res.status(201);
                                    res.send("/special-offer/" + resId);
                                }).catch((reason: any) => {
                                    console.log(reason);
                                    res.sendStatus(500);
                                });
                            }).catch((reason: any) => {
                                console.log(reason);
                                res.sendStatus(500);
                            })
                        } else {
                            res.status(400);
                            res.send("Error: Offer expires before it begins. ");
                        }
                    } else {
                        res.status(400);
                        res.send("Error: Offer too expensive. ")
                    }
                } else {
                    res.status(400);
                    res.send("Error: Item not found. ")
                }
        }).catch((reason: any) => {
            console.log(reason);
            res.sendStatus(500);
        })
    } else {
        res.status(400);
        res.send("Error: Invalid arguments. ")
    }
})

router.get("/special-offer", (req: express.Request, res: express.Response) => {
    query("SELECT * FROM SpecialOffer").then((results: any) => {
        res.status(200);
        res.json(results);
    }).catch((reason: any) => {
        console.log("reason");
        res.sendStatus(500);
    })
})


router.put("/special-offer/:id", (req: express.Request, res: express.Response) => {
    const id: number = Number(req.params.id);
    const item: number = Number(req.body.item);
    const quantity: number = Number(req.body.quantity);
    const price: number = Number(req.body.price);
    const begin: string = req.body.begin;
    const expiration: string = req.body.expiration;

    if(item !== undefined && !isNaN(item) && quantity !== undefined && !isNaN(quantity) && price !== undefined && !isNaN(price) && new Date(begin) !== undefined && new Date(expiration) !== undefined) {
        query("SELECT (? * basePrice) AS usualPrice FROM Item WHERE id = ?",
            [quantity, item]).then((results: any) => {
            if(results.length == 1) {
                const usualPrice: number = Number(results[0].usualPrice);
                if(price < usualPrice) {
                    if(new Date(begin) <= new Date(expiration)) {
                        query("UPDATE SpecialOffer SET item = ?, quantity = ?, price = ?, begin = ?, expiration = ? WHERE id = ?",
                            [item, quantity, price, begin, expiration, id]).then((results: any) => {
                            if (results.affectedRows === 1) {
                                res.sendStatus(200);
                            } else {
                                res.sendStatus(404);
                            }
                        }).catch((reason: any) => {
                            console.log(reason);
                            res.sendStatus(500);
                        });
                    } else {
                        res.status(400);
                        res.send("Error: Offer expires before it begins. ");
                    }
                } else {
                    res.status(400);
                    res.send("Error: Offer too expensive. ")
                }
            } else {
                res.status(400);
                res.send("Error: Item not found. ")
            }
        }).catch((reason: any) => {
            console.log(reason);
            res.sendStatus(500);
        })
    } else {
        res.status(400);
        res.send("Error: Invalid arguments. ")
    }
})

router.delete("/special-offer/:id", (req: express.Request, res: express.Response) => {
    const id: number = Number(req.params.id);
    query("SELECT * FROM SpecialOffer WHERE id = ?",
        [id]).then((results: any) => {
            if(results.length === 1) {
                const expiration = new Date(results[0].expiration);
                const today = new Date;
                if (today >= expiration) {
                    console.log(id);
                    query("DELETE FROM SpecialOffer WHERE id = ?",
                    [id]).then(() => {
                        res.status(200);
                        res.json(results[0]);
                    }).catch((reason: any) => {
                        console.log(reason);
                        res.sendStatus(500);
                    })
                } else {
                    res.status(400);
                    res.send("Error: Special offer not expired yet. ");
                }
            } else {
                res.sendStatus(404);
            }
    }).catch((reason: any) => {
        console.log(reason);
        res.sendStatus(500);
    })
})
