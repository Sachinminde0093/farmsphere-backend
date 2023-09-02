import token from "../../utils/token";
import Psql from "../../../psql";
import User from "./interface/user.interface";
import bcrypt from 'bcrypt';
import { Request } from 'express';


class UserService {

    private client = Psql.getInstance().getClient();

    public async register(email: String, password: string
    ): Promise<{ user: User; accessToken: string } | Error> {

        try {

            const hash = await bcrypt.hash(password, 10);

            const query = `INSERT INTO users (email, password)
            VALUES ('${email}', '${hash}');`

            await this.client.query(query);

            const query1 = `SELECT * FROM users WHERE email = '${email}';
           `;
            const data = (await this.client.query(query1)).rows[0];

            const resUser = { ...data };

            delete resUser.password;

            const user: User = resUser;

            const accessToken = await token.createToken(user);
            return { user, accessToken };
        }
        catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async login(email: String, password: string
    ): Promise<{ user: User; accessToken: string } | Error> {

        try {

            const query1 = `SELECT * FROM users WHERE email = '${email}';`;

            const data = (await this.client.query(query1)).rows[0];
            if (data) {
                const resUser = { ...data };

                if (await bcrypt.compare(password, data.password)) {
                    delete resUser.password;
                    const user: User = resUser;
                    const accessToken = await token.createToken(user);
                    return { user, accessToken };
                } else {
                    throw new Error('Unauthorized');
                }
            } else {
                throw new Error('User Not Found');
            }
        }
        catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async createRelation(req: Request): Promise<void> {
        try {

            const { receiverUserId, relationShipType } = req.body;
            const query1 = `SELECT * FROM users WHERE user_id = '${receiverUserId}';
               `;

            const data = (await this.client.query<User>(query1)).rows[0];

            if (data) {

                const senderUserId = req.user_id;

                const query3 = `SELECT * FROM userrelations
                    WHERE senderuserid = '${senderUserId}' OR receiveruserid = '${receiverUserId}';
                    `
                const rel = (await this.client.query(query3)).rows[0];

                // console.log(rel, data);

                if (!rel) {
                    if (data.AccType != relationShipType) throw new Error('invalid data provided');


                    let status: boolean = true;

                    if (data.AccType == 0) {
                        status = false;
                    }
                    const createdat: Date = new Date();

                    const query2 = `INSERT INTO userrelations (senderuserid, receiveruserid,relationshiptype,status)
                        VALUES ('${senderUserId}', '${receiverUserId}','${data.AccType}','${status}');`

                    await this.client.query(query2).then((data) => {
                        console.log(data);
                    });
                }

            } else {
                throw new Error('User Not Found');
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async acceptRequest(req: Request): Promise<void> {
        try {

            const { receiverUserId } = req.body;

            const query1 = `SELECT * FROM users WHERE user_id = '${receiverUserId}';
               `;

            const data = (await this.client.query<User>(query1)).rows[0];
            console.log(data);
            if (data) {

                const senderUserId = req.user_id;

                const query3 = `SELECT * FROM userrelations
                    WHERE senderuserid = '${senderUserId}' OR receiveruserid = '${receiverUserId}';
                    `
                const rel: any = (await this.client.query(query3)).rows[0];

                console.log(rel);

                if (rel) {

                    const query2 = `UPDATE userrelations
                    SET status = false
                    WHERE relationshipid = '${rel.relationshipid}';`

                    await this.client.query(query2);
                }

            } else {
                throw new Error('User Not Found');
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }


}

export default UserService;
// module.exports = UserService;