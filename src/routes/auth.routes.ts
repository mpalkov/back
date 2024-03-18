import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";
import { msgText, opType } from '../models/enums';
import { hasAllInputData, respond } from '../utils/authUtils';

dotenv.config();
const router = express.Router();

const SALT_ROUNDS = 10;



// POST auth/signup - crea nuevo usuario en DB
router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
	//console.log(req.body);
	const { email, password, name } = req.body;
	
	if (!hasAllInputData(opType.SIGNUP, email, password, name)) {
		respond(res, 400, msgText.INCOMPLETE_DATA_SIGNUP);
		return;
	};

	// comprueba si el e-mail tiene formato válido
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	if (!emailRegex.test(email)) {
		respond(res, 400, msgText.INVALID_EMAIL_FORMAT);
		return;
	}

	// comprueba si la contraseña cumple requisitos para ser fuerte
	const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
	if (!passwordRegex.test(password)) {
		respond(res, 400, msgText.INVALID_PASSWORD_FORMAT);
		return;
	}

	// comprueba si ya existe usuario con este e-mail

	// crea hash de password

	// crea usuario en DB con password hasheado
});

export default router;