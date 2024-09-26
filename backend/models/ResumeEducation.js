const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Ensure you have the correct path to your database configuration

const ResumeEducation = sequelize.define(
  "ResumeEducation",
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
    ResumeId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Link to a specific resume
      references: {
        model: "Resumes",
        key: "id",
      },
    },
    InstitueName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DegreeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    StartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    EndDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    EducationSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "ResumeEducation",
  }
);

sequelize
  .sync()
  .then(() => {
    console.log(
      "Resume Education table has been successfully created or updated"
    );
  })
  .catch((error) =>
    console.error(
      "This error occurred while syncing the Resume Education model:",
      error
    )
  );

module.exports = ResumeEducation;
