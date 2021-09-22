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
