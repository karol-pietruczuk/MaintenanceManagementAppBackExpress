import {Request} from "express";

export interface AuthData {
    id: string;
    iat: number;
    exp: number;
}

export interface AuthenticationRequest extends Request {
    user: AuthData
}