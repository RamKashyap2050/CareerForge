const User = require("./User");
const Resume = require("./Resume");
const ResumeBio = require("./ResumeBio");
const ResumeSummary = require("./ResumeSummary");
const ResumeSkills = require("./ResumeSkill");
const ResumeExperience = require("./ResumeExperience");
const ResumeEducation = require("./ResumeEducation");
const ResumeExtraSection = require("./ResumeExtraSection");

function applyAssociations() {
  // User and Resume (One-to-Many)
  User.hasMany(Resume, { foreignKey: "User", as: "resumes", onDelete: "CASCADE" });
  Resume.belongsTo(User, { foreignKey: "User", as: "user", onDelete: "CASCADE" });

  // Resume and ResumeBio (One-to-One)
  Resume.belongsTo(ResumeBio, { foreignKey: "ResumeBio", as: "resumeBio", onDelete: "CASCADE" });

  // Resume and ResumeSummary (One-to-One)
  Resume.belongsTo(ResumeSummary, { foreignKey: "ResumeSummary", as: "resumeSummary", onDelete: "CASCADE" });

  // Resume and ResumeSkills (One-to-One)
  Resume.belongsTo(ResumeSkills, { foreignKey: "ResumeSkills", as: "resumeSkills", onDelete: "CASCADE" });

  // Resume and ResumeExperience (One-to-Many)
  Resume.hasMany(ResumeExperience, { foreignKey: "ResumeId", as: "resumeExperiences" });
  ResumeExperience.belongsTo(Resume, { foreignKey: "ResumeId", onDelete: "CASCADE" });

  // Resume and ResumeEducation (One-to-Many)
  Resume.hasMany(ResumeEducation, { foreignKey: "ResumeId", as: "resumeEducations" });
  ResumeEducation.belongsTo(Resume, { foreignKey: "ResumeId", onDelete: "CASCADE" });

  // Resume and ResumeExtraSection (One-to-One)
  Resume.belongsTo(ResumeExtraSection, { foreignKey: "ResumeExtraSection", as: "resumeExtraSection", onDelete: "CASCADE" });
}

module.exports = { applyAssociations };
