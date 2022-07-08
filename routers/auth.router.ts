import {Router} from "express";
import jwt from 'jsonwebtoken'
import {config} from "../config/config";
import {UserRecord} from "../records/user.record";
import {AccessError, AuthError} from "../utils/error";

export const authRouter = Router()
    .post('/login', async (req, res) => {
        const email = req.body.email
        const password = req.body.password

        const user = await UserRecord.getOne(email);

        //@TODO Add comparing password with bcrypt. Password need to be hashed before writing into database.
        // const validPassword = await bcrypt.compare(password, user[0].password)

        if (!user || user.password !== password) {
            throw new AuthError('Invalid email address or password.')
        }

        const accessToken = generateAccessToken({ id: user.id })
        const refreshToken = jwt.sign({ id: user.id }, config.refreshSecretToken, { expiresIn: 525600 })
        user.refreshToken = refreshToken;
        await user.update();

        res.cookie('JWT', accessToken, {
                maxAge: 86400000,
                httpOnly: true,
        });

        res.json({
            accessToken,
            refreshToken,
            userType: user.userType,
        });
    })
    .post('/refresh', async (req, res) => {

        const refreshToken = req.body.token

        if (!refreshToken) {
                throw new AuthError("Unauthorized.");
        }

        const users = await UserRecord.getAll();

        const user = users.find((user: UserRecord) => user.refreshToken === refreshToken);

        if (!user) {
            throw new AuthError("Unauthorized.");
        }

        const validToken = jwt.verify(refreshToken, config.refreshSecretToken)

        if (!validToken) {
            throw new AccessError("Forbidden");
        }

        const accessToken = generateAccessToken({ id: user.id });

        res.cookie('JWT', accessToken, {
            maxAge: 86400000,
            httpOnly: true,
        });

        res.json({ accessToken });
    })
    .delete('/logout', async (req, res) => {
        const {refreshToken} = req.body;
        res.clearCookie("JWT");
        if (!refreshToken) throw new AuthError("Unauthorized");
        const users = await UserRecord.getAll();
        const user = users.find((user: UserRecord) => user.refreshToken === refreshToken);
        user.refreshToken = null;
        await user.update();
        res
            .status(202)
            .end();

    });

function generateAccessToken(payload: string | Object | Buffer): string {
        return jwt.sign(payload, config.secretToken, { expiresIn: 86400 }) // 86400
}

