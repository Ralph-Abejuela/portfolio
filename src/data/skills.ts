export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      "TypeScript",
      "JavaScript",
      "Java",
      "Python",
      "SQL (PostgreSQL)",
      "HTML/CSS",
    ],
  },
  { label: "Frameworks", items: ["React", "Next.js", "Node.js", "Jest"] },
  {
    label: "DevOps & Cloud",
    items: [
      "Docker",
      "GitHub Actions",
      "Virtual Machines",
      "Linux (Ubuntu)",
      "SSH",
      "Nginx",
    ],
  },
  {
    label: "Tools & Architecture",
    items: ["Git", "Android Studio", "Agile/Scrum", "MVC Architecture"],
  },
];
