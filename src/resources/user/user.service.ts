import token from "../../utils/token";
import Psql from "../../../psql";
import User from "./user.interface";
import bcrypt from 'bcrypt';


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

            console.log(resUser);

            const user: User = resUser;

            console.log(user);
            const accessToken = await token.createToken(user);
            console.log(accessToken);
            return { user, accessToken };
        }
        catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async login(email: String, password: string
    ): Promise<{ user: User; accessToken: string } | Error> {

        try {

            const query1 = `SELECT * FROM users WHERE email = '${email}';
               `;

            const data = (await this.client.query(query1)).rows[0];
            if (data) {
                const resUser = { ...data };

                if (await bcrypt.compare(password, data.password)) {
                    delete resUser.password;

                    console.log(resUser);

                    const user: User = resUser;

                    console.log(user);
                    const accessToken = await token.createToken(user);
                    console.log(accessToken);
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

}



export default UserService;
// module.exports = UserService;