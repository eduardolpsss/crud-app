const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { request } = require('http');
const { response } = require('express');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES DO PROJETO

// Criar no banco de dados
app.post('/insert', (request, response) =>{

});

// Ler no banco de dados
app.get('/getAll', (request, response) =>{
    response.json({
        sucess: true
    });
});

// Update no banco de dados

// Excluir no banco de dados

// Dando start no local server
app.listen(process.env.PORT, () => console.log('[local server] connected'));
