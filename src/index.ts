import express, {Express} from 'express';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.routes";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port} ✅`);
});


app.use("/auth", authRouter);