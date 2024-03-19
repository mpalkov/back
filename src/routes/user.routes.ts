import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { msgText } from '../models/enums';
import { findUser, getEmailFromAuthHeader, respond } from '../utils/authUtils';

dotenv.config();
const router = express.Router();
const db = new PrismaClient();

// GET /user/details
router.get('/details', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const email = await getEmailFromAuthHeader(req);
		if (!email) {
			respond(res, 500, msgText.ERR_CHECK_SERVER_LOG);
			return;
		}
		
		// obtén datos del usuario desde la DB
		const foundUser = await findUser(email);
		if (!foundUser) {
			respond(res, 400, msgText.USER_NOT_FOUND);
			return;
		}
		if (foundUser && foundUser.password)
			foundUser.password = "***"; // así no se enviará contraseña
		return res.status(200).json(foundUser);
	} catch (err) {
		console.error(err);
		respond(res, 500, msgText.ERR_CHECK_SERVER_LOG);
		return;
	}
});

// PUT /user/edit - modifica datos del usuario en la DB
router.put('/edit', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const newName = req.body.name;
		
		const email = await getEmailFromAuthHeader(req);
		if (!email) {
			respond(res, 500, msgText.ERR_CHECK_SERVER_LOG);
			return;
		}
	
		// modifica al usuario en DB
		const modifiedUser = await db.user.update({
			where: { email },
			data: { name: newName},
		});
		// si usuario ha sido modificado correctamente, responde con un OK
		// y unos datos del usuario en JSON
		if (modifiedUser) {
			const user = { email: modifiedUser?.email, name: modifiedUser?.name };
			res.status(200).json({ user });
		}
	} catch (err) {
		console.error(err);
		respond(res, 500, msgText.ERR_CHECK_SERVER_LOG);
		return;
	}
});

// DELETE /user/delete - modifica datos del usuario en la DB
router.delete('/delete', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const email = await getEmailFromAuthHeader(req);
		if (!email) {
			respond(res, 500, msgText.ERR_CHECK_SERVER_LOG);
			return;
		}

		// borra al usuario de DB
		const deletedUser = await db.user.delete({
			where: { email },
			select: { email: true }
		});
		// si usuario ha sido borrado correctamente, responde con un OK
		// y mensaje
		if (deletedUser) {
			respond(res, 200, msgText.USR_DELETED);
		}
	} catch (err) {
		console.error(err);
		respond(res, 500, msgText.ERR_CHECK_SERVER_LOG);
		return;
	}
});

export default router;