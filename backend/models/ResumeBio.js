const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Ensure you have the correct path to your database configuration

const ResumeBio = sequelize.define(
  "ResumeBio",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    User: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    GithubLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LinkedInLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    WebsiteLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "ResumeBio",
  }
);

sequelize
  .sync()
  .then(() => {
    console.log(
      "Resume Bio table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) =>
    console.error(
      "This error occurred while syncing the Resume Bio model:",
      error
    )
  );

module.exports = ResumeBio;
