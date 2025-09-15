import { Injectable } from '@angular/core';
import { RpaProject } from '../models/rpa-project.model';
import { Program } from '../models/program.model';
import { UserData } from '../models/user-data.model';
import { Team } from '../models/team.model';
import { Directorate } from '../models/directorate.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private rpaProjects: RpaProject[] = [
    {
      projectId: 1,
      projectName: 'Invoice Processing Automation',
      projectType: 'Finance',
      status: 'Production',
      robotsCount: 2,
      manhourSavings: 1200,
      valueGenerated: 250000,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-20'),
      createdBy: 'USR001',
      directorateId: 1
    },
    {
      projectId: 2,
      projectName: 'HR Onboarding Bot',
      projectType: 'HR',
      status: 'Development',
      robotsCount: 1,
      manhourSavings: 800,
      valueGenerated: 150000,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-08-25'),
      createdBy: 'USR002',
      directorateId: 2
    },
    {
      projectId: 3,
      projectName: 'Inventory Management System',
      projectType: 'Operations',
      status: 'Planning',
      robotsCount: 3,
      manhourSavings: 2100,
      valueGenerated: 400000,
      createdAt: new Date('2024-06-10'),
      updatedAt: new Date('2024-08-30'),
      createdBy: 'USR003',
      directorateId: 3
    }
  ];

  private programs: Program[] = [
    {
      programId: 1,
      programName: 'WAFI',
      phase: 'Industrialization',
      status: 'On Track',
      comments: 'Initial requirements gathering completed. Phase 4 kickoff planned for July.',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-08-15'),
      createdBy: 'USR001'
    },
    {
      programId: 2,
      programName: 'GCPO',
      phase: 'POC',
      status: 'Delayed by 20%',
      comments: 'Project delivered. Field Testing and Support in progress.',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-08-20'),
      createdBy: 'USR002'
    },
    {
      programId: 3,
      programName: 'RPA',
      phase: 'Scale',
      status: 'On Track',
      comments: 'Successfully launched 108 processes, and actively working on developing additional...',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-08-25'),
      createdBy: 'USR003'
    },
    {
      programId: 4,
      programName: 'ADAM',
      phase: 'MDP',
      status: 'On Track',
      comments: 'We have successfully rolled out two use cases, with end-user testing currently in pr...',
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-08-30'),
      createdBy: 'USR004'
    },
    {
      programId: 5,
      programName: 'STEP',
      phase: 'Industrialized',
      status: 'On Track',
      comments: '361 well has been deployed',
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-09-01'),
      createdBy: 'USR005'
    }
  ];

  private directorates: Directorate[] = [
    { directorateId: 1, name: 'Corporate Planning', code: 'CP', description: 'Strategic planning and corporate development', createdAt: new Date('2023-01-01') },
    { directorateId: 2, name: 'Exploration & Venture Development', code: 'EVD', description: 'Oil and gas exploration activities', createdAt: new Date('2023-01-01') },
    { directorateId: 3, name: 'Engineering', code: 'ENG', description: 'Engineering and technical services', createdAt: new Date('2023-01-01') },
    { directorateId: 4, name: 'Finance', code: 'FIN', description: 'Financial planning and management', createdAt: new Date('2023-01-01') },
    { directorateId: 5, name: 'Health, Safety & Environment', code: 'HSE', description: 'Health, safety and environmental compliance', createdAt: new Date('2023-01-01') }
  ];

  private teams: Team[] = [
    { teamId: 1, teamName: 'IDE 1', description: 'Digital Innovation Team 1', createdAt: new Date('2023-01-01'), directorateId: 1 },
    { teamId: 2, teamName: 'IDE 2', description: 'Digital Innovation Team 2', createdAt: new Date('2023-01-01'), directorateId: 1 },
    { teamId: 3, teamName: 'IDE 3', description: 'Digital Innovation Team 3', createdAt: new Date('2023-01-01'), directorateId: 2 },
    { teamId: 4, teamName: 'IDE 4', description: 'Digital Innovation Team 4', createdAt: new Date('2023-01-01'), directorateId: 2 },
    { teamId: 5, teamName: 'IDE 5', description: 'Digital Innovation Team 5', createdAt: new Date('2023-01-01'), directorateId: 3 },
    { teamId: 6, teamName: 'IDE 6', description: 'Digital Innovation Team 6', createdAt: new Date('2023-01-01'), directorateId: 3 },
    { teamId: 7, teamName: 'IDE 7', description: 'Digital Innovation Team 7', createdAt: new Date('2023-01-01'), directorateId: 4 },
    { teamId: 8, teamName: 'IDE 8', description: 'Digital Innovation Team 8', createdAt: new Date('2023-01-01'), directorateId: 5 }
  ];

  getRpaProjects(): RpaProject[] {
    return [...this.rpaProjects];
  }

  getPrograms(): Program[] {
    return [...this.programs];
  }

  getDirectorates(): Directorate[] {
    return [...this.directorates];
  }

  getTeams(): Team[] {
    return [...this.teams];
  }

  createRpaProject(project: Omit<RpaProject, 'projectId' | 'createdAt' | 'updatedAt'>): RpaProject {
    const newProject: RpaProject = {
      ...project,
      projectId: Math.max(...this.rpaProjects.map(p => p.projectId)) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.rpaProjects.push(newProject);
    return newProject;
  }

  updateRpaProject(id: number, updates: Partial<RpaProject>): RpaProject {
    const index = this.rpaProjects.findIndex(p => p.projectId === id);
    if (index === -1) throw new Error('Project not found');
    
    this.rpaProjects[index] = {
      ...this.rpaProjects[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.rpaProjects[index];
  }

  deleteRpaProject(id: number): void {
    const index = this.rpaProjects.findIndex(p => p.projectId === id);
    if (index === -1) throw new Error('Project not found');
    this.rpaProjects.splice(index, 1);
  }

  createProgram(program: Omit<Program, 'programId' | 'createdAt' | 'updatedAt'>): Program {
    const newProgram: Program = {
      ...program,
      programId: Math.max(...this.programs.map(p => p.programId)) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.programs.push(newProgram);
    return newProgram;
  }

  updateProgram(id: number, updates: Partial<Program>): Program {
    const index = this.programs.findIndex(p => p.programId === id);
    if (index === -1) throw new Error('Program not found');
    
    this.programs[index] = {
      ...this.programs[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.programs[index];
  }

  deleteProgram(id: number): void {
    const index = this.programs.findIndex(p => p.programId === id);
    if (index === -1) throw new Error('Program not found');
    this.programs.splice(index, 1);
  }
}
