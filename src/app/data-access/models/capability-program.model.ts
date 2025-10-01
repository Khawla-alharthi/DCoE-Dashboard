export interface CapabilityProgram {
  programId: number;
  name: string;
  type: 'Staff Digital Muscle' | 'On-the-Job Training' | 'CI Ideas' | 'Training Completed' | 'Training In Progress' | 'Certifications';
  count: number;
  status: 'Completed' | 'In Progress' | 'Planned' | 'On Hold';
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}