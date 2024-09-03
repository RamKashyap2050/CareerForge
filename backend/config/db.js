const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        require: true, // This ensures SSL is required
        rejectUnauthorized: false, // This allows connection even if the SSL certificate is self-signed or not fully trusted
      },
    },
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Error: " + err));

module.exports = sequelize; // Export the sequelize instance directly
