const sequelize = require("sequelize");

const connection = new sequelize('Perguntas', 'root', '123brochine', {
    host:'localhost',
    dialect:'mysql'
});

module.exports = connection;
