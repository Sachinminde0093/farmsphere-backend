import mysql from 'mysql';
import config from './credentials/config';

class Mysql {
    private static instance: Mysql;
    private con: mysql.Connection;

    private constructor() {
        const { MYSQL } = config;

        this.con = mysql.createConnection(MYSQL);

        this.con.connect(function(err:any) {
            if (err) throw err;
            console.log("Connected to MySQL database!");
          });

    }

    public static getInstance(): Mysql {

        if (!Mysql.instance) {
            Mysql.instance = new Mysql();
        }
        return Mysql.instance;
    }

    public getConnection(): mysql.Connection {
        return this.con;
    }
}

export default Mysql;
