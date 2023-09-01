import express, { Application } from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import Mysql from './mysql';
import Psql from './psql';
import config from './credentials/config'
import ErrorMiddleware from './src/middleware/error.middleware';
import admin from 'firebase-admin';
// const serviceAccount = require('credentials/firebaseServiceAccountKey.json') 

import HttpException from './src/utils/exceptions/http.exception';
// const HttpException = require('@/utils/exceptions/http.exception');

import { Request, Response, NextFunction } from 'express';
import Controller from 'utils/interfaces/controller.interface';
import RedisConnection from './redis.connection';

import { createServer } from "http";
import { Server } from "socket.io";
import SocketCon from './socket';



class App {

    public express: Application;
    private httpServer = createServer(express);
    private io : Server = new Server(this.httpServer, { 
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
          }
     });

    public port: number;
    public socket : SocketCon;

    constructor(controllers: Controller[]) {
        this.express = express()
        this.socket = new SocketCon(this.io);
        console.log(config.PORT)
        this.port = config.PORT || 8080;

        Mysql.getInstance().getConnection();
        Psql.getInstance().getClient();
        RedisConnection.getInstance().getClient();
        // this.initialiseDatabaseConnection();
        this.initializeMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    

    
    initializeMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initialiseErrorHandling(): void {
        
        this.express.use(ErrorMiddleware);
    }

    // private initialiseDatabaseConnection(): void {

    //     const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, } = config;

    //     const CONNECTION_URL : string = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
    //     try {
    //         mongoose.connect(CONNECTION_URL)
    //             .then(() => {
    //                 console.log('Connected to MongoDB');
                   
    //             })
    //             .catch((err) => {
    //                 console.log(err.message)
    //             });

    //     } catch (error) {
    //         console.log(`❌  Failed: Error establishing database connection`);
    //         console.error(error);
    //         process.exit(1);
    //     }

    //     // { useNewUrlParser: true, useUnifiedTopology: true }
    // }

 
 

    public listen(): void {
        this.httpServer.listen(this.port, () => {
            console.log(`App listen on the port: ${this.port}`);
        });
    }

}

export default App;
