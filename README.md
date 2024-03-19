# SOLVE_THE_X: BACK

## Descripción
**SOLVE_THE_X: BACK** es un API REST desarrollado en **Node.js** y **TypeScript**, con **SQLite3** como base de datos.
Esta API proporciona 5 endpoints para hacer operaciones CRUD sobre usuarios.

### Aspectos Destacados

- **JWT (JSON Web Token)**: Se utilizan para autenticación y autorización.
- **Seguridad**: Las contraseñas se almacenan de forma encriptada.
- **Prisma con SQLite3**: Prisma simplifica la interacción con la base de datos.


## Instalación
1. Clona este repositorio: `git clone https://github.com/mpalkov/back.git`
2. Navega al directorio del proyecto: `cd back`
3. Instala las dependencias: `npm install`
4. Transpila el código TypeScript a JavaScript: `npm run build`

## Endpoints

| Endpoint | Descripción | Método HTTP | Respuesta |
|-----------------|-------------|-------------|-----------|
| `/auth/signup` | Crea un nuevo usuario en la base de datos | POST | Datos de usuario en formato JSON |
| `/auth/login` | Autentica al usuario | POST | JWT firmado con caducidad de 2 horas |
| `/user/details` | Obtiene detalles del usuario mismo | GET | Objeto JSON con todos los datos del usuario y contraseña sobreescrita con *** |
| `/user/edit` | Modifica datos de usuario en la base de datos | PUT | Objeto JSON con email y nombre nuevo del usuario |
| `/user/delete` | Borra el usuario de la base de datos | DELETE | Objeto JSON con email y nombre nuevo del usuario |


## Funcionalidad CRUD

- **Crear (POST)**: Crea un nuevo usuario o elemento.
- **Leer (GET)**: Obtiene información de usuarios o elementos existentes.
- **Actualizar (PUT)**: Modifica datos de usuarios o elementos.
- **Eliminar (DELETE)**: Elimina usuarios o elementos.

## Dependencias

- **bcryptjs**: Encriptación de contraseñas.
- **body-parser**: Analiza datos de solicitudes HTTP.
- **dotenv**: Carga variables de entorno desde un archivo `.env`.
- **express**: Framework para crear aplicaciones web.
- **jsonwebtoken**: Genera y verifica tokens JWT.
- **sqlite3**: Base de datos SQLite3.

## Pruebas Unitarias

Para probar la lógica de negocio, ejecuta el siguiente comando:

```bash
npm run test
```
Esto verificará la funcionalidad de registro de un nuevo usuario utilizando la librería Jest.