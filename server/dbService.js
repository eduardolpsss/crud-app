const mysql = require('mysql');
const dotenv = require('dotenv');
const {
    Interface
} = require('readline');

let instance = null;

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

// Criando classe que inclui funcionalidades do banco de dados
class dbService {
    static getDbServiceInstance() {
        return instance ? instance : new dbService();
    }

    // Exibição de dados
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users_infos;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Inserção de itens na tabela
    async insertNewName(user_name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO users_infos (user_name, date_added) VALUES (?,?);";

                connection.query(query, [user_name, dateAdded], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(result.insertId);
                })
            });
            console.log('[database] item inserido no banco de dados, id: ' + insertId);

            // Retornando objeto com as informações presentes no banco de dados
            return {
                id: insertId,
                user_name: user_name,
                dateAdded: dateAdded
            };
        } catch (error) {
            console.log(error);
        }
    }

    // Delete pelo botão
    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM users_infos WHERE id = ?";

                connection.query(query, [id], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(result.affectedRows);
                })
            });
            // Método de controle de exclusão para dar reaload na página
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, user_name) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE users_infos SET user_name = ? WHERE id = ?";

                connection.query(query, [user_name, id], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(result.affectedRows);
                })
            });
            // Método de controle de exclusão para dar reaload na página
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByName(user_name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users_infos WHERE user_name = ?;";

                connection.query(query, [user_name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = dbService;