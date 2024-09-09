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
    ResumeBio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ResumeBio",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ResumeSkills: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ResumeSkills",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ResumeExperience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ResumeExperience",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ResumeEducation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ResumeEducation",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ResumeExtraSection: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ResumeExtraSection",
        key: "id",
      },
      onDelete: "CASCADE",
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
      "Resume table has been successfully created, if one doesn't exist"
    );
  })
  .catch((error) =>
    console.error("This error occurred while syncing the Resume model:", error)
  );

module.exports = Resume;
