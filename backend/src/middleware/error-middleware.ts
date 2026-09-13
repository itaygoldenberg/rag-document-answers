import { NextFunction, Request, Response } from "express";
import { ClientError } from "../models/client-error";

class ErrorMiddleware {

    public routeNotFound(request: Request, response: Response, next: NextFunction): void {
        next(new ClientError(404, "Route not found."));
    }

    public catchAll(err: any, request: Request, response: Response, next: NextFunction): void {
        console.error(err.message ?? err);
        const status = err.status ?? 500;
        const message = status === 500 ? "Something went wrong on the server." : err.message;
        response.status(status).json({ message });
    }
}

export const errorMiddleware = new ErrorMiddleware();