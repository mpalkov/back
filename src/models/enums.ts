export enum opType {
	SIGNUP = 1,
	LOGIN,
}

export enum msgText {
	INCOMPLETE_DATA_SIGNUP = "Introduce e-mail, contraseña y nombre.",
	INCOMPLETE_DATA_LOGIN = "Introduce e-mail y contraseña.",
	INVALID_EMAIL_FORMAT = "El e-mail no tiene formato válido.",
	INVALID_PASSWORD_FORMAT = "La contraseña debe tener al menos 6 carácteres e incluir al menos un dígito, una letra minúscula y una mayúscula.",
	ERR_CHECK_SERVER_LOG = "Ha ocurrido un error, comprueba log del servidor.",
	ALREADY_EXISTS = "Ya existe usuario con este e-mail.",
	USER_NOT_FOUND = "No existe usuario con este e-mail.",
	WRONG_PASS = "La contraseña no es correcta."
}