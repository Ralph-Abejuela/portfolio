export interface ProjectImage {
  src: string;
  srcset?: string;
  sizes?: string;
  width?: number;
  height?: number;
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
    tagline: "Your job applications, parsed entirely in your browser.",
    stack: "REACT · TYPESCRIPT · GMAIL API · TRANSFORMERS.JS · DEXIE.JS",
    points: [
      "Parses LinkedIn, Indeed, and 50+ ATS email patterns into a structured application timeline.",
      "Client-only architecture: OAuth tokens, email data, and ML inference never leave the browser.",
      "Unknown sender? An on-device Transformers.js classifier handles it without shipping your mail to any server.",
    ],
    link: "https://github.com/Ralph-Abejuela/ejobtrack",
    linkLabel: "GITHUB",
    website: "https://ejobtrack.ralphabejuela.com",
    websiteLabel: "WEBSITE",
    images: [
      {
        src: "ejobtrack-og.png",
        alt: "ejobtrack dashboard showing parsed job application statuses",
        caption: "ejobtrack",
      },
    ],
    dates: "JUL 2026 – PRESENT",
  },
  {
    name: "Agri-Connect",
    tagline: "Warehouse management system for a government agency in Albay.",
    stack: "REACT · NODE.JS · TYPESCRIPT · POSTGRESQL · DOCKER · NGINX",
    points: [
      "Built and shipped inventory management, automated report generation, and a Facebook chatbot that replaced manual pricing inquiries.",
      "Deployed with CI/CD: GitHub Actions builds, SSH deploy, Nginx.",
    ],
    images: [
      {
        src: "agri-connect-dashboard.png",
        alt: "Agri-Connect warehouse dashboard",
        caption: "Dashboard",
      },
      {
        src: "agri-connect-export-dialog.png",
        alt: "Agri-Connect export dialog",
        caption: "Export dialog",
      },
      {
        src: "agri-connect-warehouse-item.png",
        alt: "Agri-Connect warehouse item input",
        caption: "Warehouse item input",
      },
      {
        src: "agri-connect-wheat-price.png",
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
        src: "tagisan-fb-photo.jpg",
        alt: "Tagisan ng Talino campus event photo",
        caption: "Event photo",
      },
      {
        src: "tagisan-certificate.jpg",
        alt: "Tagisan ng Talino certificate",
        caption: "Certificate",
      },
      {
        src: "tagisan-app.jpg",
        alt: "Tagisan ng Talino movie reservation app",
        caption: "App",
      },
    ],
    dates: "MAR 2024 – APR 2024",
  },
];
