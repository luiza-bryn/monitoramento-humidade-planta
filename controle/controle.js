// Inicia o Express.js
const express = require('express');
const app = express();

// Body Parser - usado para processar dados da requisição HTTP
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Inicia o Servidor HTTP na porta 8080
let porta = 8080;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});

// Importa o package do SQLite 
const sqlite3 = require('sqlite3');

// Acessa o arquivo com o banco de dados
var db = new sqlite3.Database('./dados.db', (err) => {
        if (err) {
            console.log('ERRO: não foi possível acessar o banco de dados.');
            throw err;
        }
        console.log('Conectado ao SQLite!');
    });

// Cria a tabela parametros, caso ela não exista
db.run(`CREATE TABLE IF NOT EXISTS parametros
        (id INTEGER PRIMARY KEY NOT NULL UNIQUE, umidade_seco INTEGER NOT NULL)`, 
        [], (err) => {
           if (err) {
              console.log('ERRO: não foi possível criar tabela.');
              throw err;
           }
      });

// Método HTTP POST /parametros - cadastra um novo parametro
app.post('/parametros', (req, res, next) => {
    db.run(`INSERT INTO parametros(id, umidade_seco) VALUES(?, 500)`, 
         [req.body.id], (err) => {
        if (err) {
            console.log("Erro: " + err);
            res.status(500).send('Erro ao cadastrar parametro.');
        } else {
            console.log('parametro cadastrado com sucesso!');
            res.status(200).send('parametro cadastrado com sucesso!');
        }
    });
});

// Método HTTP GET /parametros - retorna a umidade_seco de todos os parametros
app.get('/parametros', (req, res, next) => {
    db.all( `SELECT * FROM parametros`, [], (err, result) => {
        if (err) { 
            console.log("Erro: "+err);
            res.status(500).send('Erro ao obter dados.');
        } else {
            res.status(200).json(result);
        }
    });
});

// Método HTTP GET /parametros/:id - retorna a umidade_seco do parametro com base no id
app.get('/parametros/:id', (req, res, next) => {
    db.get( `SELECT * FROM parametros WHERE id = ?`, 
            req.params.id, (err, result) => {
        if (err) { 
            console.log("Erro: "+err);
            res.status(500).send('Erro ao obter dados.');
        } else if (result == null) {
            console.log("parametro não encontrado.");
            res.status(404).send('parametro não encontrado.');
        } else {
            res.status(200).json(result);
        }
    });
});


// Método HTTP PATCH /parametros
app.patch('/parametros/:id', (req, res, next) => {
    db.run(`UPDATE parametros SET umidade_seco = ? WHERE id = ?`,
           [req.body.umidade_seco, req.params.id], function(err) {
            if (err){
                res.status(500).send('Erro ao alterar dados.');
            } else if (this.changes == 0) {
                console.log("Dado não encontrado.");
                res.status(404).send('Dado não encontrado.');
            } else {
                res.status(200).send('Umidade relativa alterada com sucesso!');
            }
    });
});

//Método HTTP DELETE /parametros/:id - remove um parametro
app.delete('/parametros/:id', (req, res, next) => {
    db.run(`DELETE FROM parametros WHERE id = ?`, req.params.id, function(err) {
      if (err){
         res.status(500).send('Erro ao remover parametro.');
      } else if (this.changes == 0) {
         console.log("parametro não encontrado.");
         res.status(404).send('parametro não encontrado.');
      } else {
         res.status(200).send('parametro removido com sucesso!');
      }
   });
});