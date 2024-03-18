import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";

dotenv.config();
const router = express.Router();

const SALT_ROUNDS = 10;



// POST auth/signup - crea nuevo usuario en DB
router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
	//console.log(req.body);
	const { email, password, name } = req.body;
	
	// comprueba si hay email y password y name
	if (email === "" || password === "" || name === "") {
		res.status(400).json({ message: "Introduce e-mail, contraseña y nombre." });
		return;
	}

	// comprueba si el e-mail tiene formato válido

	// comprueba si la contraseña cumple requisitos para ser fuerte

	// comprueba si ya existe usuario con este e-mail

	// crea hash de password

	// crea usuario en DB con password hasheado
});

export default router;