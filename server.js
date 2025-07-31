require('dotenv').config();
const express = require('express');
const app = express();
// const agentesRouter = require("./routes/agentesRouter");
const casosRouter = require("./routes/casosRouter");
const agentesRouter = require("./routes/agentesRouter");
const PORT = process.env.PORT_SERVER;

// app.use((req, res, next) => {
//     const start = Date.now();

//     console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
//     console.log('Query params:', req.query);
//     console.log('Body params:', req.body);

//     const originalSend = res.send;
//     res.send = function (body) {
//         console.log('Response:', body);
//         console.log(`Handled in ${Date.now() - start}ms`);
//         originalSend.call(this, body);
//     };

//     next();
// });

app.use(express.json());

app.use(casosRouter);
app.use(agentesRouter);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT} em modo de desenvolvimento`);
}); 

const setupSwagger = require('./docs/swagger');
setupSwagger(app);