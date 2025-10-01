import { Team } from "./team.model";

export interface TeamActivity {
  activityId: number;
  activityName: string;
  activityDate: Date;
  status: 'Planning' | 'In Progress' | 'Done';
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  teamId: number;
  team?: Team;
}
