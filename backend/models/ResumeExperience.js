const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Ensure you have the correct path to your database configuration
const Resume = require("./Resume"); // Import the Resume model

const ResumeExperience = sequelize.define(
  "ResumeExperience",
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
    CompanyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RoleTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    StartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    EndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ExperienceSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "ResumeExperience",
  }
);

// sequelize
//   .sync()
//   .then(() => {
//     console.log(
//       "Resume Experience table has been successfully created or updated"
//     );
//   })
//   .catch((error) =>
//     console.error(
//       "This error occurred while syncing the Resume Experience model:",
//       error
//     )
//   );

module.exports = ResumeExperience;
