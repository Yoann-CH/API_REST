const Sequelize = require("sequelize");

const connection = new Sequelize(
  "mysql://root:password@localhost:3306/database"
);

connection.authenticate().then(() => console.log("Database connected"));

module.exports = connection;
