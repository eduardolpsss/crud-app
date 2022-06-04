const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { request } = require('http');
const { response } = require('express');
dotenv.config();

// Incluindo conexão com o banco de dados
const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Criar no banco de dados
app.post('/insert', (request, response) => {
    const { user_name } = request.body;
    const db = dbService.getDbServiceInstance();

    // Chamando função de inserção de nome na tabela do banco de dados
    const result = db.insertNewName(user_name);

    result
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
});

// Ler no banco de dados
app.get('/getAll', (request, response) =>{

    // Chamando função que pega dados tabela do banco de dados
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

// Update no banco de dados
app.patch('/update', (request, response) => {
    const { id, name } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(id, name);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
})

// Excluir no banco de dados
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

// Pesquisar no banco de dados
app.get('/search/:user_name', (request, response) => {
    const { user_name } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(user_name);

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));

})

// Dando start no local server
app.listen(process.env.PORT, () => console.log('[local server] connected'));
