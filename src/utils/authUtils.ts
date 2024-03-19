import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { opType } from "../models/enums";
import jwt from "jsonwebtoken";

const db = new PrismaClient();

/**
 * Comprueba si hay datos introducidos
 */
export const hasAllInputData = (operation:number, email:string, password:string, name?:string, ) => {
	if (operation === opType.SIGNUP && name === "")
		return false;	
	if (email === "" || password === "")
		return false;
	return true;
};

/**
 * Envia una respuesta con HTTP status code y JSON con mensaje
 */
export const respond = (res:Response, statusCode:number, messageText?:string) => {
	res.status(statusCode).json({ message: messageText });
}

/**
 * Encuentra usuario según email en la DB
 */
export const findUser = async (email:string) => {
	try {
        const foundUser = await db.user.findFirst({ where: { email: email } });
        if (!foundUser) {
            return null;
        } else {
            return foundUser;
        }
    } catch (err) {
		// catch the error in containing block
    }
}

// obtén mail del usuario desde Auth header de la petición
export const getEmailFromAuthHeader = async (req: Request) => {
	try {
		if (
			!req.headers.authorization ||
			req.headers.authorization.split(" ")[0] !== "Bearer"
		)
			return null;
		// obtén el token codificado
		const token = req.headers.authorization.split(" ")[1];
		const decodedTokenObject = jwt.verify(token, String(process.env.TOKEN_SECRET))
		//console.log('token decoded: ', decodedTokenObject);
		const { email } = Object(decodedTokenObject);
		return email;
		//console.log('mail es:', email);
	} catch (err) {
		console.error(err);
		return null;
	}
};