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
