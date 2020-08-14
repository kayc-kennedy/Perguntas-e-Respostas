const sequelize = require("sequelize");
const connection = require("./database");

//Criar tabela de perguntas
const pergunta = connection.define('pergunta',{
    titulo:{//Capo titulo
        type: sequelize.STRING,
        allowNull:false // especifico que o campo titulo nunca poderá ficar vazio
    },
    descricao:{//Campo descrição 
        type: sequelize.TEXT,
        allowNull: false
    }
})

//Sincroniza com o banco, caso a tabela nao exista, a mesma é criada
pergunta.sync({force:false}).then(() => {});

module.exports = pergunta;