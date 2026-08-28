export interface ExperienceItem {
  role: string;
  org: string;
  location: string;
  dates: string;
  points: string[];
}

export const experience: ExperienceItem[] = [
  {
    role: "Backend Developer Intern",
    org: "Department of Science and Technology Region V",
    location: "Legazpi City, Albay",
    dates: "FEB 2026 – MAY 2026",
    points: [
      "Led a 3-person OJT team building REST API microservices in TypeScript and Node.js, including a strategic planning CRUD service.",
      "Refactored microservices from Clean Architecture to MVC patterns, improving long-term maintainability.",
      "Integrated PostgreSQL, containerized services with Docker, and wrote unit tests with Jest.",
    ],
  },
  {
    role: "Treasurer",
    org: "CSC STI College Legazpi",
    location: "Legazpi City, Albay",
    dates: "NOV 2022 – JUN 2023",
    points: [
      "Processed and tracked council expenditures with 100% accuracy in financial records.",
      "Collected and reconciled event fees from 157 students.",
    ],
  },
];
