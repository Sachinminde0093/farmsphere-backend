import { Request, Response, NextFunction } from 'express';
import token from '../utils/token';

import HttpException from "../utils/exceptions/http.exception";
import jwt from 'jsonwebtoken';
import Token from 'utils/interfaces/token.interface';
import Client from '../../psql';
import User from '../resources/user/user.interface';

async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {

    const client = Client.getInstance().getClient();

    const bearer = req.headers.authorization;


    if (!bearer || !bearer.startsWith('Bearer')) {
        return next(new HttpException(401, 'Unauthorised'));
    }

    const accessToken = bearer.split('Bearer')[1].trim();
    // const accessToken: string = bearer!;
    try {
        const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
            accessToken
        );

        // console.log(payload);

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        const query = `SELECT * FROM users WHERE user_id = '${payload.id}';
            `;

        const data = (await client.query(query)).rows[0];

        if (!data) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        const user = { ...data };
        delete user.password;

        req.user = user;

        req.user_id = user.user_id;

        return next();
    } catch (error) {
        console.log(error);
        return next(new HttpException(401, 'Unauthorised'));
    }
}

export default authenticatedMiddleware;
