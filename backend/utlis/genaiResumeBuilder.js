const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateCustomResume = async (jobDescription, resumeText) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Updated structured prompt
    const prompt = `
    I have provided a job description and a resume. You are a resume builder whose goal is to tailor resumes for job descriptions to pass through Applicant Tracking Systems (ATS).
    
    Your task is to modify the resume in the following ways based on the job description provided:
    
    1. **Updating the skills section**:
        - Cross-reference the skills in the resume with the skills in the job description.
        -Don't Remove any skills from resume as they are the Candidates hard earned skillset
        - Add job-specific skills from the job description that may not be present in the resume. For example, if the job description requires "GraphQL" and the resume mentions "REST API", either replace "REST API" with "GraphQL" or add "GraphQL" alongside "REST API" where appropriate, Same goes with Backend languages and Frameworks, ORM tools, Testing Frameworks, Frontend Frameworks and languages.
    
    2. **Updating the experience points**:
        - For every new skill added to the skills section (e.g., "GraphQL" or "AWS"), **add or modify experience points** in the experience section to explain where and how the candidate applied this skill in their previous roles. For example, if "GraphQL" is added, include an experience point under relevant roles that highlights how the candidate used GraphQL in backend development.
        - If there is no direct experience for a newly added skill, add inferred points based on the role responsibilities with the newly added skill.
        - Adjust existing experience points to make them more **impactful**, including specific accomplishments or metrics. For example, instead of “worked on Microservices,” modify it to “Developed and deployed Microservices using Node.js, reducing load times by 20%.”
        - Ensure that the experience duration aligns with the job description and keep the **start date and end date** intact.
        - Ensure the points has these verbs always "Acquired, Catered, Cut, Activated, Coached,Decreased, Adapted, Collaborated*,Delivered ,Adopted
Communicated,Designed,Advised,Completed, Developed, Advocated, Conceptualized, Directed, Allocated, Conducted, Doubled (Tripled, etc.), Analyzed*. Connected
Drafted, Assessed, Contributed, Drove*, Assisted, Converted, Earned, Authored, Coordinated*, Elevated, Automated, Corrected, Empowered
Engineered, Held, Lowered, Ensured*, Identified, Maintained. Evaluated
Implemented*
Managed*
Exceeded
Increased*
Mentored
Excelled
Initiated
Met
Expanded
Instituted
Migrated
Facilitated*
Intervened
Negotiated
Finalized
Introduced
Optimized
Furthered
Investigated
Outlined
Generated*
Launched
Oversaw

Led*
Owned*

Leveraged
Partnered

Liaised
198
Performed*" As they are action verbs which impress employers
    3. **Modifying the professional summary**:
        - Tailor the summary to reflect the **job-relevant skills** and expertise from the job description. Use keywords from the job description to make the summary more relevant to the specific position being applied for.
        - Do not mention specific company names or roles. Focus on general expertise, accomplishments, and the added skills.
    
    4. **Maintaining Bio Information**:
        - Ensure that the candidate’s **name, email, phone number, LinkedIn, GitHub, personal website, and location** remain unchanged, but include them in the final JSON output.
    
    5. **Updating the education section**:
        - Adjust the education points to reflect relevance to the candidate’s field of study. If the user has a "Bachelor’s in Computer Science," include points like GPA or relevant coursework to the job.
        - Keep the **institution name, degree type, and dates** intact, but add any relevant details that make the education section more aligned with the job description.
    
    Return the updated resume in the following structured JSON format:
    
    {
      "bio": {
        "firstName": "<First Name>",
        "lastName": "<Last Name>",
        "email": "<Email>",
        "phoneNumber": "<Phone Number>",
        "linkedin": "<LinkedIn URL>",
        "github": "<GitHub URL>",
        "website": "<Personal Website URL>",
        "location": "<Location>"
      },
      "summary": "<updated summary>",
      "skills": ["<list of updated skills>"],
      "experiences": [
        {
          "companyName": "<company name>",
          "roleTitle": "<role title>",
          "startDate": "<start date>",
          "endDate": "<end date>",
          "experienceDetails": ["<updated experience points that justify new skills>"]
        }
      ],
      "education": [
        {
          "institution": "<institution name>",
          "degreeType": "<degree type>",
          "startDate": "<start date>",
          "endDate": "<end date>",
          "educationDetails": ["<updated education points>"]
        }
      ]
    }
    
    Job Description: ${jobDescription}
    
    Resume Text: ${resumeText}`;

    const result = await model.generateContent(prompt);
    let structuredOutput = result.response.text();
    
    // 🔧 Strip markdown formatting if it exists
    structuredOutput = structuredOutput
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();
    
    let parsedResume;
    try {
      parsedResume = JSON.parse(structuredOutput);
    } catch (err) {
      console.error("❌ Failed to parse AI resume JSON:", err.message);
      return null; // or handle however you want
    }
    
    return parsedResume;
  } catch (error) {
    console.error("❌ AI Resume Generation Error:", error.message);
    return null;
  }
};

module.exports = { generateCustomResume };
