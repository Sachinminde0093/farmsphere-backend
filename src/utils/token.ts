
import jwt from 'jsonwebtoken';

import Token from './interfaces/token.interface';
import User from 'resources/user/interface/user.interface';

export const createToken = (user: User): string => {
    // console.log(user);
    // console.log(user._id)
    const token =  jwt.sign({ id: user.user_id }, "secrete Key", {
        expiresIn: '5d'
    });
    // console.log(token);
    return token;
}

export const verifyToken = async (
    token: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            "secrete Key",
            (err, payload) => {
                if (err) return reject(err);

                resolve(payload as Token);
            }
        );
    });
}

export default { createToken, verifyToken };