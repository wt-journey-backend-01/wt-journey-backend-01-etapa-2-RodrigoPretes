require('dotenv').config();
const express = require('express');
const app = express();
const casosRouter = require("./routes/casosRoutes");
const agentesRouter = require("./routes/agentesRoutes");
const PORT = process.env.PORT_SERVER;

app.use(express.json());

app.use(casosRouter);
app.use(agentesRouter);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT} em modo de desenvolvimento`);
}); 

const setupSwagger = require('./docs/swagger');
setupSwagger(app);