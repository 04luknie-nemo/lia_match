import { Technology } from "./technology";

export interface Workplace {
  id: number;
  shownId: string;
  bussinessName: string;
  city: string;
  applicationUrl: string;
  websiteUrl: string;
  previousLiaStudents: number;
  technologies: Technology[];
  isAppointed: boolean;
}
