import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {
}

export class AuthError extends Error {
}

export class AccessError extends Error {

}

export const handleError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res
        .status(err instanceof ValidationError ? 400 : err instanceof AuthError ? 401 : err instanceof AccessError ? 403 : 500)
        .json({
            message: err instanceof ValidationError || err instanceof AuthError || err instanceof AccessError ? err.message : 'Sorry, please try again later'
        });
};