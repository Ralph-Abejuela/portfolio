export interface ProjectItem {
  name: string;
  tagline: string;
  stack: string;
  points: string[];
  link?: string;
  linkLabel?: string;
  website?: string;
  websiteLabel?: string;
  dates: string;
}

export const projects: ProjectItem[] = [
  {
    name: "ejobtrack",
    tagline: "Zero-server job tracker that parses your Gmail.",
    stack: "REACT · TYPESCRIPT · GMAIL API · TRANSFORMERS.JS · DEXIE.JS",
    points: [
      "Auto-syncs Gmail via OAuth 2.0 and parses application status from LinkedIn, Indeed, and 50+ ATS.",
      "Client-only architecture — tokens, email data, and ML inference never leave the browser.",
      "On-device Transformers.js ML fallback for unknown senders; fuzzy duplicate detection.",
    ],
    link: "https://github.com/Ralph-Abejuela/ejobtrack",
    linkLabel: "GITHUB",
    website: "https://ejobtrack.ralphabejuela.com",
    websiteLabel: "WEBSITE",
    dates: "JUL 2026 – PRESENT",
  },
  {
    name: "Agri-Connect",
    tagline: "Warehouse management system for a government agency.",
    stack: "REACT · NODE.JS · TYPESCRIPT · POSTGRESQL · DOCKER · NGINX",
    points: [
      "Full-stack warehouse management with automated report generation and a custom Facebook chatbot for inquiries and pricing.",
      "Automated build and deployment via GitHub Actions, SSH, and Nginx.",
    ],
    dates: "FEB 2025 – NOV 2025",
  },
  {
    name: "Tagisan ng Talino: Codefest",
    tagline: "1st place campus, 2nd place cluster finals.",
    stack: "JAVA · ANDROID STUDIO",
    points: [
      "Led a 3-person team to 1st place building a movie reservation app.",
      "Secured 2nd place in STI cluster finals against 8 schools.",
    ],
    dates: "MAR 2024 – APR 2024",
  },
];
