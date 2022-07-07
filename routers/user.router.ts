import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {AccessError} from "../utils/error";
import {UserType} from "../types";
import {AuthenticationRequest} from "../types/auth/auth";
import {authenticate} from "../utils/auth";

export const userRouter = Router()
    .get('/', authenticate, async (req: AuthenticationRequest, res) => {
        const user = await UserRecord.getOne(req.user.id, true);
        if (user.userType !== UserType.Admin) throw new AccessError("Forbidden");
        const users = await UserRecord.getAll();
        res.json(users)
});

