import {
    FaEnvelope,
    FaPhone,
    FaLinkedin,
    FaGithub,
    FaGlobe,
  } from "react-icons/fa";
  
  const ResumeCard = ({ resume, onEdit, onPrint }) => {
    const {
      resumeBio,
      resumeSummary,
      resumeSkills,
      resumeExperiences,
      resumeEducations,
    } = resume;
  
    return (
      <div className="max-w-4xl w-full mx-auto my-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold">
              {resumeBio.FirstName} {resumeBio.LastName}
            </h2>
            <p className="text-sm text-gray-500">{resumeBio.Location}</p>
          </div>
          <div className="flex gap-3 text-gray-600 mt-4 md:mt-0 text-lg">
            {resumeBio.Email && <FaEnvelope title="Email" />}
            {resumeBio.PhoneNumber && <FaPhone title="Phone" />}
            {resumeBio.LinkedInLink && <FaLinkedin title="LinkedIn" />}
            {resumeBio.GithubLink && <FaGithub title="GitHub" />}
            {resumeBio.WebsiteLink && <FaGlobe title="Website" />}
          </div>
        </div>
  
        {/* SUMMARY */}
        {resumeSummary && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Professional Summary</h3>
            <div
              className="text-sm text-gray-700 mt-2 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: resumeSummary.Summary }}
            />
          </div>
        )}
  
        {/* SKILLS */}
        {resumeSkills && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {resumeSkills.Skills.split(",").map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
  
        {/* EXPERIENCE */}
        {resume.resumeExperiences?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Experience</h3>
            {resume.resumeExperiences.map((exp, idx) => (
              <div key={idx} className="mb-4 border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">
                  {exp.RoleTitle} @ {exp.CompanyName}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(exp.StartDate).toLocaleDateString()} –{" "}
                  {exp.EndDate
                    ? new Date(exp.EndDate).toLocaleDateString()
                    : "Present"}
                </p>
                <ul className="list-disc list-inside text-sm mt-2 whitespace-pre-line text-gray-700">
                  {exp.ExperienceSummary?.split("\n").map((point, i) =>
                    point ? (
                      <li key={i}>{point.replace("* ", "")}</li>
                    ) : null
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
  
        {/* EDUCATION */}
        {resume.resumeEducations?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Education</h3>
            {resume.resumeEducations.map((edu, idx) => (
              <div key={idx} className="mb-4 bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold">{edu.InstitueName}</h4>
                <p className="text-sm text-gray-500">
                  {edu.DegreeType} | {new Date(edu.StartDate).getFullYear()} –{" "}
                  {new Date(edu.EndDate).getFullYear()}
                </p>
                <div
                  className="text-sm mt-2 text-gray-700"
                  dangerouslySetInnerHTML={{ __html: edu.EducationSummary }}
                />
              </div>
            ))}
          </div>
        )}
  
        {/* ACTION BUTTONS */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => onEdit(resume.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onPrint(resume.id)}
            className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 transition"
          >
            Download PDF
          </button>
        </div>
      </div>
    );
  };
  
  export default ResumeCard;
  
  