import { Request } from "express";
import { signupUser } from "./signupUtils";



const newUniqueEmail = () => {
	return `${Date.now()}@gmail.com`;
};
let uniqueEmail = newUniqueEmail();
//console.log('uniqueEmail:', uniqueEmail);

describe('signupUtils - test de registro de un nuevo usuario', () => {
	test('tiene que dar error si no hay request', () => {
		expect(signupUser(undefined as any)).rejects.toStrictEqual(expect.objectContaining({
			success: false,
		}));
	});
		
	test('tiene que devolver al user', async () => {
		expect(signupUser({ body: { "email": uniqueEmail, "name": "My Name", "password": "iudsanoiasdm43wnmt43itn-A" }} as Request)).resolves.toStrictEqual(expect.objectContaining({
			email: uniqueEmail,
		}));
	});
});
