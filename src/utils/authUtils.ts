import { Request, Response, NextFunction } from "express";
import { opType } from "../models/enums";

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