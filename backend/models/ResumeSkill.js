const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Ensure you have the correct path to your database configuration

const ResumeSkills = sequelize.define(
  "ResumeSkills",
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
    Skills: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "ResumeSkills",
  }
);

// sequelize
//   .sync()
//   .then(() => {
//     console.log(
//       "Resume Skills table has been successfully created, if one doesn't exist"
//     );
//   })
//   .catch((error) =>
//     console.error(
//       "This error occurred while syncing the Resume Skills model:",
//       error
//     )
//   );

module.exports = ResumeSkills;
