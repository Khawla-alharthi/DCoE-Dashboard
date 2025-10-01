export interface Program {
  programId: number;
  programName: string;
  phase: string;
  status: 'On Track' | 'Delayed by 20%' | 'At Risk';
  comments: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
