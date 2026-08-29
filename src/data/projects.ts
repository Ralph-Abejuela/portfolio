export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectItem {
  name: string;
  tagline: string;
  stack: string;
  points: string[];
  link?: string;
  linkLabel?: string;
  website?: string;
  websiteLabel?: string;
  images?: ProjectImage[];
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
    images: [
      {
        src: "/images/projects/ejobtrack-og.png",
        alt: "ejobtrack — zero-server job tracker",
        caption: "ejobtrack",
      },
    ],
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
    images: [
      {
        src: "/images/projects/agri-connect-dashboard.png",
        alt: "Agri-Connect warehouse dashboard",
        caption: "Dashboard",
      },
      {
        src: "/images/projects/agri-connect-export-dialog.png",
        alt: "Agri-Connect export dialog",
        caption: "Export dialog",
      },
      {
        src: "/images/projects/agri-connect-warehouse-item.png",
        alt: "Agri-Connect warehouse item input",
        caption: "Warehouse item input",
      },
      {
        src: "/images/projects/agri-connect-wheat-price.png",
        alt: "Agri-Connect wheat price",
        caption: "Wheat price",
      },
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
    images: [
      {
        src: "/images/projects/tagisan-fb-photo.jpg",
        alt: "Tagisan ng Talino campus event photo",
        caption: "Event photo",
      },
      {
        src: "/images/projects/tagisan-certificate.jpg",
        alt: "Tagisan ng Talino certificate",
        caption: "Certificate",
      },
      {
        src: "/images/projects/tagisan-app.jpg",
        alt: "Tagisan ng Talino movie reservation app",
        caption: "App",
      },
    ],
    dates: "MAR 2024 – APR 2024",
  },
];
