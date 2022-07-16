import {AuthData, AuthenticationRequest} from "../types/auth/auth";
import {NextFunction, Response} from "express";
import {AccessError, AuthError} from "./error";
import jwt from "jsonwebtoken";
import {config} from "../config/config";

export function authenticate(req: AuthenticationRequest, res: Response, next: NextFunction) {
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    const token: string = req.cookies.JWT;
    if (token === null || token === undefined) throw new AuthError("Please login first.");

    jwt.verify(token, config.secretToken, (err, user: AuthData) => {
        if (err) throw new AuthError("Invalid access token.");
        req.user = user;
        next();
    });
}