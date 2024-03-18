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
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	if (!emailRegex.test(email)) {
	  res.status(400).json({ message: "El e-mail no tiene formato válido." });
	  return;
	}

	// comprueba si la contraseña cumple requisitos para ser fuerte
	const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
	if (!passwordRegex.test(password)) {
	  res.status(400).json({
		message:
		  "La contraseña debe tener al menos 6 carácteres e incluir al menos un dígito, una letra minúscula y una mayúscula."
	  });
	  return;
	}

	// comprueba si ya existe usuario con este e-mail

	// crea hash de password

	// crea usuario en DB con password hasheado
});

export default router;