import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";
import { msgText, opType } from '../models/enums';
import { hasAllInputData, respond } from '../utils/authUtils';
import bcrypt from "bcryptjs";
import { PrismaClient } from '@prisma/client';

dotenv.config();
const router = express.Router();
const db = new PrismaClient();
const SALT_ROUNDS = 10;

// POST auth/signup - crea nuevo usuario en DB
router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
	//console.log('reqbody:', req.body);
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

	// crea hash del password
	const salt = bcrypt.genSaltSync(SALT_ROUNDS);
	const hashedPassword = bcrypt.hashSync(password, salt);

	// crea usuario en DB con password hasheado
	const createdUser = await db.user.create({
		data: {
			name: name,
			email: email,
			password: hashedPassword
		}
	});
	// si usuario ha sido creado correctamente, responde con un OK
	// y unos datos del usuario en JSON (sin incluir la contraseña)
	if (createdUser) {
		const user = { email: createdUser?.email, name: createdUser?.name };
		res.status(201).json({ user });
	}
});

export default router;