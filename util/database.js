const Sequelize = require('sequelize');

const sequelize = new Sequelize('ntcg', 'root', 'aringking1104', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
