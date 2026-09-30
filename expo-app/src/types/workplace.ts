interface Technology {
  id: number;
  name: string;
}

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
