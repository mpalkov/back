import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";
import { msgText, opType } from '../models/enums';
import { findUser, hasAllInputData, respond } from '../utils/authUtils';
import bcrypt from "bcryptjs";
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";
import { signupUser } from '../utils/signupUtils';

dotenv.config();
const router = express.Router();
const db = new PrismaClient();
const SALT_ROUNDS = 10;

// POST auth/signup - crear nuevo usuario en DB
router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
	// respunde con status 201 y algunos datos del usuario creado (sin la contraseña) 
	return await signupUser(req)
		.then( (createdUser) => {
			if (createdUser) {
				const user = { email: createdUser?.email, name: createdUser?.name };
				res.status(201).json({ user });
			}
		})
		.catch(err => {
			console.error(err);
			respond(res, 500, msgText.ERR_CHECK_SERVER_LOG);
			return;
		});
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
			return;
		}
	
		// comprueba que la contraseña del usuario es correcta
		if (!bcrypt.compareSync(password, foundUser.password)) {
			respond(res, 401, msgText.WRONG_PASS);
			return;
		}
		// si la contraseña es correcta, se continua
		const { id, name } = foundUser;
		// Crea un objeto que servirá de payload del JWT
		const payload = { id, email, name };
	
		// crea JWT y fírmalo
		const authToken = jwt.sign(payload, String(process.env.TOKEN_SECRET) , {
			algorithm: "HS256",
			expiresIn: "2h",
		});
		
		// envía el token en la respuesta
		res.status(200).json({ authToken: authToken });
	} catch (err) {
		console.error(err);
		respond(res, 500, msgText.ERR_CHECK_SERVER_LOG);
		return;
	}
});

export default router;