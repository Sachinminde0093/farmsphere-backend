import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv'
import config from './credentials/config'

import ErrorMiddleware from './src/middleware/error.middleware';
import admin from 'firebase-admin';
// const serviceAccount = require('credentials/firebaseServiceAccountKey.json') 

import HttpException from './src/utils/exceptions/http.exception';
// const HttpException = require('@/utils/exceptions/http.exception');

import { Request, Response, NextFunction } from 'express';
import Controller from 'utils/interfaces/controller.interface';

class App {

    public express: Application;
    public port: number;

    constructor(controllers: Controller[]) {
        this.express = express()
        console.log(config.PORT)
        this.port = config.PORT || 8080;

        this.initialiseDatabaseConnection();
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

    private initialiseDatabaseConnection(): void {

        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, } = config;

        

        const CONNECTION_URL : string = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
        // const CONNECTION_URL: string = 'mongodb+srv://sachinminde9359:Sachin@9359$minde@cluster0.ifmjnwo.mongodb.net/HOUSE_HUB';
        // const uri = `mongodb+srv://sachinminde9359:Sachin9359minde@cluster0.ifmjnwo.mongodb.net/househub`; // Replace with your MongoDB connection URI
            // console.log(CONNECTION_URL)
        try {
            const uri = `mongodb+srv://sachinminde9359:Sachin9359minde@cluster0.ifmjnwo.mongodb.net/househub`; // Replace with your MongoDB connection URI
            mongoose.connect(CONNECTION_URL)
                .then(() => {
                    console.log('Connected to MongoDB');
                    // Continue with your application logic here
                })
                .catch((err) => {
                    // throw err;
                    console.log(err.message)
                });

        } catch (error) {
            console.log(`❌  Failed: Error establishing database connection`);
            console.error(error);
            process.exit(1);
        }

        // { useNewUrlParser: true, useUnifiedTopology: true }
    }
 

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listen on the port: ${this.port}`);
        });
    }

}

export default App;
