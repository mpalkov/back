import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { opType } from "../models/enums";

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

// Encuentra usuario según email en la DB
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