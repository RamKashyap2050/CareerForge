const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Ensure you have the correct path to your database configuration
const Resume = require("./Resume");  // Ensure the path is correct

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Resume, {
  foreignKey: "User", // This should match the `User` field in the `Resume` model
  as: "resumes",     // Alias for easier access
  onDelete: "CASCADE",  // Ensure that when a user is deleted, their resumes are also deleted
});

sequelize
  .sync({alter:true})
  .then(() => {
    console.log(
      "User table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) =>
    console.error("This error occurred while syncing the User model:", error)
  );

module.exports = User;
