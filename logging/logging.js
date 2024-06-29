// Inicia o Express.js
const express = require('express');
const app = express();

// Body Parser - usado para processar dados da requisição HTTP
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Inicia o Servidor na porta 8090
let porta = 8090;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});

// Importa o package do SQLite
const sqlite3 = require('sqlite3');

// Acessa o arquivo com o banco de dados
var db = new sqlite3.Database('./dados.db', (err) => {
        if (err) {
            console.log('ERRO: não foi possível conectar ao SQLite.');
            throw err;
        }
        console.log('Conectado ao SQLite!');
    });

// Cria a tabela umidade, caso ela não exista
db.run(`CREATE TABLE IF NOT EXISTS umidade 
        (id INTEGER PRIMARY KEY NOT NULL UNIQUE,
        umidade INTEGER,
        data DATETIME)`, 
        [], (err) => {
           if (err) {
              console.log('ERRO: não foi possível criar tabela.');
              throw err;
           }
      });

// Método HTTP POST /logging - cadastra uma nova umidade
app.post('/logging', (req, res, next) => {
    db.run(`INSERT INTO umidade(id, umidade, data) VALUES(?,?,?)`, 
         [req.body.id, req.body.umidade, req.body.data], (err) => {
        if (err) {
            console.log("Error: " + err);
            res.status(500).send('Erro ao cadastrar umidade.');
        } else {
            console.log('umidade cadastrada com sucesso!');
            res.status(200).send('umidade cadastrada com sucesso!');
        }
    });
});

// Método HTTP GET /logging - retorna todos as umidades já coletadas na vida
app.get('/logging', (req, res, next) => {
    db.all(`SELECT * FROM umidade`, [], (err, result) => {
        if (err) {
             console.log("Erro: " + err);
             res.status(500).send('Erro ao obter dados.');
        } else {
            res.status(200).json(result);
        }
    });
});

// Método HTTP GET /logging/recente - retorna a umidade mais recentemente coletada
app.get('/logging/recente', (req, res, next) => {
    db.get( `SELECT * FROM umidade ORDER BY data DESC LIMIT 1`, [], (err, result) => {
        if (err) { 
            console.log("Erro: "+err);
            res.status(500).send('Erro ao obter dados.');
        } else if (result == null) {
            console.log("Cliente não encontrado.");
            res.status(404).send('Cliente não encontrado.');
        } else {
            res.status(200).json(result);
        }
    });
});