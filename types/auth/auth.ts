import {Request} from "express";
import {UserType} from "../user";

export interface AuthData {
    id: string;
    iat: number;
    exp: number;
}

export interface AuthenticationRequest extends Request {
    user: AuthData
}