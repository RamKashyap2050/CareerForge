const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Ensure you have the correct path to your database configuration

const ResumeExtraSection = sequelize.define(
  "ResumeExtraSection",
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
    ExtraSectionName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  
    ExtraSectionSummary: {
      type: DataTypes.TEXT, 
      allowNull: true, 
    },
  },
  {
    timestamps: true,
  }
);

sequelize
  .sync()
  .then(() => {
    console.log(
      "Resume Extra Section table has been successfully created or updated"
    );
  })
  .catch((error) =>
    console.error(
      "This error occurred while syncing the Resume Experience model:",
      error
    )
  );

module.exports = ResumeExperience;
 