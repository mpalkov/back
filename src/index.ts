import express, {Express} from 'express';

const app: Express = express();
const port = /* process.env.PORT || */ 8000;

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port} ✅`);
});
