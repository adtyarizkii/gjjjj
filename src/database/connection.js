const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize("coba2", "adit", "knitto15", {
  host: "192.168.20.6",
  port: "3311",
  dialect: "mysql",
  logging: console.log,
  freezeTableName: true,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

db.sequelize = sequelize;

module.exports = db;