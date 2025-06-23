import express, { Router } from 'express';
import 'dotenv/config'
import cors from 'cors';
import { database } from './database/database.js'
import usuarioRoutes from './routes/usuarioRoutes.js';
import veiculoRoutes from './routes/veiculoRoutes.js';
import acessoRoutes from './routes/acessoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';


const app = express();
app.use(cors());
app.use(express.json())

app.use('/usuarios', usuarioRoutes);
app.use('/veiculos', veiculoRoutes);
app.use('/acessos', acessoRoutes);
app.use('/admin', adminRoutes);

try {
    await database.authenticate();
    await database.sync({ alter: true })
    console.log("Banco de dados conectado");
} catch (erro) {
    console.log(erro);
}

app.listen(3000, () => console.log('API rodando na porta 3000'));