import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";
import { msgText, opType } from '../models/enums';
import { findUser, hasAllInputData, respond } from '../utils/authUtils';
import bcrypt from "bcryptjs";
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();
const db = new PrismaClient();
const SALT_ROUNDS = 10;

// POST auth/signup - crea nuevo usuario en DB
router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
	try {
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
		const foundUser = await findUser(email);
		if (foundUser) {
			respond(res, 400, msgText.ALREADY_EXISTS);
			console.log(msgText.ALREADY_EXISTS, ' RETURN');
			return;
		}
	
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
	} catch (err) {
		console.error(err);
		respond(res, 500, msgText.ERR_CHECK_SERVER_LOG);
		return;
	}
});

// POST  /auth/login - Comprueba email y password y crea JWT
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
	
		// comprueba que tenemos email y password
		if (!hasAllInputData(opType.LOGIN, email, password)) {
			respond(res, 400, msgText.INCOMPLETE_DATA_LOGIN);
			return;
		};
	
		// comprueba en DB si usuario existe
		const foundUser = await findUser(email);
		if (!foundUser) {
			respond(res, 400, msgText.USER_NOT_FOUND);
			console.log(msgText.USER_NOT_FOUND, ' RETURN');
			return;
		}
	
		// comprueba que la contraseña del usuario es correcta
		if (!bcrypt.compareSync(password, foundUser.password)) {
			respond(res, 401, msgText.WRONG_PASS);
			console.log(msgText.WRONG_PASS, 'RETURN');
			return;
		}
		// si la contraseña es correcta, se continua
		const { id, name } = foundUser;
		// Crea un objeto que servirá de payload del JWT
		const payload = { id, email, name };
	
		// crea JWT y fírmalo
		// console.log('TOKEN SECRET from .env', String(process.env.TOKEN_SECRET));
		const authToken = jwt.sign(payload, String(process.env.TOKEN_SECRET) , {
			algorithm: "HS256",
			expiresIn: "2h",
		});
		console.log('authTOKEN ✅: \n', authToken);
		
		// envía el token en la respuesta
		res.status(200).json({ authToken: authToken });
	} catch (err) {
		console.error(err);
		respond(res, 500, msgText.ERR_CHECK_SERVER_LOG);
		return;
	}
});

export default router;