import { Directorate } from "./directorate.model";

export interface RpaProject {
  projectId: number;
  projectName: string;
  projectType: string;
  status: 'Planning' | 'Development' | 'Production' | 'Under Discussion';
  robotsCount: number;
  manhourSavings: number;
  valueGenerated: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  directorateId: number;
  directorate?: Directorate;
}
