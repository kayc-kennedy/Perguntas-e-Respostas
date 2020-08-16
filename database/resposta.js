const sequelize = require("sequelize");
const connection = require("./database");

const resposta = connection.define("respostas", {
    corpo: { // Criando a tabela de respostas
        type: sequelize.TEXT,
        allowNull: false
    },
    perguntaId: {
        type: sequelize.INTEGER,
        allowNull: false
    }
});

resposta.sync({force: false});

module.exports = resposta;