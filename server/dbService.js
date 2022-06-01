const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

// Criando conexão com o banco de dados utilizando o .env para passar as informações
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

// Verificando se a conexão foi feita com sucesso
connection.connect((err) => {
    if (err) {
        console.log('[database] ' + err.message);
    }
    console.log('[database] ' + connection.state);
});