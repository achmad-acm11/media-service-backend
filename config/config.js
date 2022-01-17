require("dotenv").config();

const { DB_USERNAME, DB_PASSWROD, DB_NAME, DB_HOST, DB_PORT } = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWROD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: "mysql",
    port: DB_PORT,
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWROD,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWROD,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
