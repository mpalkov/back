import { Request } from "express";
import { msgText, opType } from "../models/enums";
import { User } from "../models/interfaces";
import { findUser, hasAllInputData, respond } from "./authUtils";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const SALT_ROUNDS = 10;

/** Crea un nuevo usuario */
export async function signupUser(req: Request): Promise<User> {
	const { email, password, name } = req?.body ?? {};

	if (!req) {
		// devuelve un error
		return Promise.reject({success: false, statusCode: 400, messageText: 'error' })
	}
	// comprueba si hay email, password y name
	if (!hasAllInputData(opType.SIGNUP, email, password, name)) {
		return Promise.reject({success: false, statusCode: 400, messageText: msgText.INCOMPLETE_DATA_SIGNUP});
	};

	// comprueba si el e-mail tiene formato válido
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	if (!emailRegex.test(email)) {
		return Promise.reject({success: false, statusCode: 400, messageText: msgText.INVALID_EMAIL_FORMAT});
	}

	// comprueba si la contraseña cumple requisitos para ser fuerte
	const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
	if (!passwordRegex.test(password)) {
		return Promise.reject({success: false, statusCode: 400, messageText: msgText.INVALID_PASSWORD_FORMAT});
	}
	
	// comprueba si ya existe usuario con este e-mail
	const foundUser = await findUser(email);
	if (foundUser) {
		return Promise.reject({success: false, statusCode: 400, messageText: msgText.ALREADY_EXISTS});
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
	const user = { id:createdUser?.id, email: createdUser?.email};
	return Promise.resolve(user);
};