# **Resume Builder**

**Resume Builder** is a full-stack web application that allows users to create, edit, and manage resumes. Users can input their personal details, work experiences, skills, and more, while also being able to download the final resume as a PDF.

## **Table of Contents**

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## **Features**

- Create, edit, and delete resumes.
- Add multiple sections to resumes:
  - Personal Bio
  - Professional Summary
  - Skills
  - Work Experience
  - Education
  - Extra Sections (Certifications, Achievements, etc.)
- Real-time preview of resumes.
- Download resume as a PDF.
- User authentication (Login/Register).
- Responsive design optimized for both desktop and mobile.
- Integrated Google Maps API for location-based inputs.

## **Tech Stack**

- **Frontend**: React.js, Material UI, Vite.js.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (using Sequelize ORM).
- **Authentication**: Passport.js (Session-based).
- **File Management**: PDF-lib for generating downloadable PDFs.
- **Other Tools**: Axios for API calls, Google Maps API for location autocomplete.

## **Project Structure**

```bash
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- models/
|   |-- routes/
|   |-- middleware/
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- utils/
|   |-- public/

git clone https://github.com/yourusername/resume-builder.git
cd resume-builder

cd backend
npm install

cd ../frontend
npm install

PORT=5000
DATABASE_URL=your_postgres_db_url
SESSION_SECRET=your_secret_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

cd backend
nodemon server.js

cd ../frontend
npm run dev

## **API Endpoints**

### **Authentication:**
- **POST** `/users/login`: Log a user in.
- **POST** `/users/register`: Register a new user.

### **Resume Management:**
- **GET** `/resume/resumes`: Fetch all resumes for the authenticated user.
- **GET** `/resume/resumes/:resumeId`: Fetch a specific resume by ID.
- **PUT** `/resume/resume-bio`: Create or update a resume bio.
- **PUT** `/resume/resume-skills`: Create or update a resume skills.
- **PUT** `/resume/resume-experience`: Add or update work experience in a resume.

### **Experience Management:**
- **POST** `/resume/experience`: Add a new experience.


### **PDF Generation:**
- **POST** `/pdf/generate`: Generate a downloadable PDF for a resume.

---

## **Future Enhancements**

Here are some ideas for future enhancements to the Resume Builder:

- Add multiple resume templates for users to choose from.
- Export resumes to formats such as Word and Markdown.
- Add rich text formatting to experience and summary fields.
- LinkedIn API integration for importing professional data.
- Improved resume recommendations and analytics.

