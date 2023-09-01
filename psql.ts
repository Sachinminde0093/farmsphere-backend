import { Client, ClientConfig } from 'pg';
import config from './credentials/config';

class Psql {

    private static instance: Psql;
    private client: Client;

    private constructor() {
        const { PSQL } = config;
        this.client = new Client(PSQL as ClientConfig);
        this.client.connect()
            .then(() => {
                console.log('Connected to PostgreSQL database!');
                // this.createTable();
            })
            .catch((err) => {
                console.error('Error connecting to PostgreSQL:', err);
            });
    }

    public async createTable() {
        try {
            await this.client.query(`
                CREATE TABLE IF NOT EXISTS demo (
                    id serial PRIMARY KEY,
                    username VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL
                );
            `);
            console.log('Table "users" created successfully!');
        } catch (error) {
            console.error('Error creating table:', error);
        }
    }

    public static getInstance(): Psql {
        if (!Psql.instance) {
            Psql.instance = new Psql();
        }
        return Psql.instance;
    }

    public getClient(): Client {
        return this.client;
    }
}

export default Psql;
