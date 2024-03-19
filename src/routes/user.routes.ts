import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { msgText } from '../models/enums';
import { findUser, respond } from '../utils/authUtils';

dotenv.config();
const router = express.Router();

// GET /user/details
router.get('/details', async (req: Request, res: Response, next: NextFunction) => {
	try {
		// obtén mail del usuario desde Auth header de la petición
		if (
			req.headers.authorization &&
			req.headers.authorization.split(" ")[0] === "Bearer"
		  ) {
				// obtén el token codificado
				const token = req.headers.authorization.split(" ")[1];
				const decodedTokenObject = jwt.verify(token, String(process.env.TOKEN_SECRET))
				//console.log('token decoded: ', decodedTokenObject);
				const { email } = Object(decodedTokenObject);
				//console.log('mail es:', email);
				
				// obtén datos del usuario desde la DB
				const foundUser = await findUser(email);
				if (!foundUser) {
					respond(res, 400, msgText.USER_NOT_FOUND);
					//console.log(msgText.USER_NOT_FOUND, ' RETURN');
					return;
				}
				if (foundUser && foundUser.password)
					foundUser.password = "***"; // así no se enviará contraseña
				//console.log('found user: ',foundUser);
				res.status(200).json(foundUser)
			}
	} catch (err) {
		console.error(err);
		respond(res, 500, msgText.ERR_CHECK_SERVER_LOG);
		return;
	}
});

export default router;