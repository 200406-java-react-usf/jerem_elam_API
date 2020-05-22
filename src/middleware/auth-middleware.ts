import { Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from '../errors/errors';


/**
 * this is being used to set a guard on your admin
 * @param req 
 * @param resp 
 * @param next 
 */
const adminGuard = (req: Request, resp: Response, next) => {
    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found, please login.'));
    } else if (req.session.principal.role_name === 'admin') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }
}

/**
 * this is being used to set a guard on your finance Manager
 * @param req 
 * @param resp 
 * @param next 
 */
const financeGuard = (req: Request, resp: Response, next) => {
    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found, please login.'));
    } else if (req.session.principal.role_name === 'finance') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }
}

export {
    adminGuard,
    financeGuard
}