const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Ensure you have the correct path to your database configuration
// Import the related models
const User = require("./User")
const ResumeBio = require("./ResumeBio");
const ResumeSummary = require("./ResumeSummary");
const ResumeSkills = require("./ResumeSkill");
const ResumeExperience = require("./ResumeExperience");
const ResumeEducation = require("./ResumeEducation");
const ResumeExtraSection = require("./ResumeExtraSection");

const Resume = sequelize.define(
  "Resume",
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
    ResumeSummary: {
      type: DataTypes.INTEGER,
      references: {
        model: "ResumeSummary",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ResumeSkills: {
      type: DataTypes.INTEGER,
      references: {
        model: "ResumeSkills",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ResumeExperience: {
      type: DataTypes.INTEGER,
      references: {
        model: "ResumeExperience",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ResumeEducation: {
      type: DataTypes.INTEGER,
      references: {
        model: "ResumeEducation",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ResumeExtraSection: {
      type: DataTypes.INTEGER,
      references: {
        model: "ResumeExtraSection",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    Status: {
      type: DataTypes.ENUM("draft", "completed"),
      defaultValue: "draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Resume;


// Resume.belongsTo(ResumeBio, { foreignKey: "ResumeBio", as: "resumeBio" });
// Resume.belongsTo(ResumeSummary, {
//   foreignKey: "ResumeSummary",
//   as: "resumeSummary",
// });
// Resume.belongsTo(ResumeSkills, {
//   foreignKey: "ResumeSkills",
//   as: "resumeSkills",
// });
// Resume.belongsTo(ResumeExperience, {
//   foreignKey: "ResumeExperience",
//   as: "resumeExperience",
// });
// Resume.hasMany(ResumeExperience, {
//   foreignKey: "ResumeId",
//   as: "resumeExperiences",
// });

// Resume.belongsTo(ResumeEducation, {
//   foreignKey: "ResumeEducation",
//   as: "resumeEducation",
// });
// Resume.hasMany(ResumeEducation, {
//   foreignKey: "ResumeId",
//   as: "resumeEducations",
// });
// Resume.belongsTo(ResumeExtraSection, {
//   foreignKey: "ResumeExtraSection",
//   as: "resumeExtraSection",
// });
// Resume.belongsTo(User, {
//   foreignKey: "User", // This should match the `User` field in the Resume model
//   as: "user", // Alias, adjust it based on your preference
//   onDelete: "CASCADE",
// });

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log(
//       "Resume table has been successfully created, if one doesn't exist"
//     );
//   })
//   .catch((error) =>
//     console.error("This error occurred while syncing the Resume model:", error)
//   );

