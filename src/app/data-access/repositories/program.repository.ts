import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Program {
  programId: number;
  programName: string;
  description: string;
  directorateId: number;
  directorate?: string;
  leaderId: number;
  leaderName?: string;
  status: 'Planning' | 'Active' | 'Completed' | 'On Hold';
  startDate: Date;
  endDate?: Date;
  budget: number;
  actualSpent: number;
  progress: number; // 0-100
  objectives: string[];
  keyResults: string[];
  rpaProjectsCount: number;
  valueGenerated: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProgramRepository {
  private apiUrl = '/api/programs';

  // Mock data for development
  private mockPrograms: Program[] = [
    {
      programId: 1,
      programName: 'Digital Ambition 2030',
      description: 'Comprehensive digital transformation initiative to modernize operations and drive efficiency',
      directorateId: 1,
      directorate: 'Upstream',
      leaderId: 1,
      leaderName: 'Ahmed Al-Rashid',
      status: 'Active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2030-12-31'),
      budget: 50000000, // 50M USD
      actualSpent: 12500000, // 12.5M USD
      progress: 25,
      objectives: [
        'Automate 80% of routine processes',
        'Achieve $30M in cost savings',
        'Reduce processing time by 60%',
        'Implement AI-driven decision support systems'
      ],
      keyResults: [
        '150 RPA bots deployed',
        '$15M cost savings achieved',
        '40% reduction in processing time',
        '95% employee satisfaction with digital tools'
      ],
      rpaProjectsCount: 12,
      valueGenerated: 15000000,
      isActive: true,
      createdAt: new Date('2023-11-15'),
      updatedAt: new Date('2024-09-01')
    },
    {
      programId: 2,
      programName: 'Operations Excellence Initiative',
      description: 'Streamlining operational processes through automation and digital optimization',
      directorateId: 3,
      directorate: 'Operations',
      leaderId: 3,
      leaderName: 'Mohammed Al-Balushi',
      status: 'Active',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2026-12-31'),
      budget: 25000000,
      actualSpent: 8500000,
      progress: 45,
      objectives: [
        'Optimize production workflows',
        'Implement predictive maintenance',
        'Reduce operational costs by 20%',
        'Enhance safety protocols'
      ],
      keyResults: [
        '85 automated workflows',
        '30% reduction in downtime',
        '$8M cost savings',
        'Zero safety incidents'
      ],
      rpaProjectsCount: 8,
      valueGenerated: 12000000,
      isActive: true,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-08-30')
    },
    {
      programId: 3,
      programName: 'Smart Analytics Platform',
      description: 'Building advanced analytics capabilities for data-driven decision making',
      directorateId: 2,
      directorate: 'IT',
      leaderId: 5,
      leaderName: 'Fatima Al-Zahra',
      status: 'Planning',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2027-12-31'),
      budget: 18000000,
      actualSpent: 0,
      progress: 5,
      objectives: [
        'Deploy enterprise data lake',
        'Implement real-time dashboards',
        'Build predictive models',
        'Enable self-service analytics'
      ],
      keyResults: [
        'Single source of truth for data',
        '50+ real-time dashboards',
        '90% accuracy in predictions',
        '200+ users trained on analytics tools'
      ],
      rpaProjectsCount: 3,
      valueGenerated: 0,
      isActive: true,
      createdAt: new Date('2024-08-01'),
      updatedAt: new Date('2024-09-10')
    }
  ];

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Program[]> {
    // TODO: Replace with actual HTTP call when backend is ready
    // return this.http.get<Program[]>(this.apiUrl);
    return of(this.mockPrograms);
  }

  getById(id: number): Observable<Program | undefined> {
    // TODO: Replace with actual HTTP call
    // return this.http.get<Program>(`${this.apiUrl}/${id}`);
    return of(this.mockPrograms.find(p => p.programId === id));
  }

  create(program: Omit<Program, 'programId' | 'createdAt' | 'updatedAt' | 'rpaProjectsCount' | 'valueGenerated'>): Observable<Program> {
    // TODO: Replace with actual HTTP call
    // return this.http.post<Program>(this.apiUrl, program);
    const newProgram: Program = {
      ...program,
      programId: Math.max(...this.mockPrograms.map(p => p.programId)) + 1,
      rpaProjectsCount: 0,
      valueGenerated: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockPrograms.push(newProgram);
    return of(newProgram);
  }

  update(id: number, program: Partial<Program>): Observable<Program> {
    // TODO: Replace with actual HTTP call
    // return this.http.put<Program>(`${this.apiUrl}/${id}`, program);
    const index = this.mockPrograms.findIndex(p => p.programId === id);
    if (index !== -1) {
      this.mockPrograms[index] = {
        ...this.mockPrograms[index],
        ...program,
        updatedAt: new Date()
      };
      return of(this.mockPrograms[index]);
    }
    throw new Error('Program not found');
  }

  delete(id: number): Observable<void> {
    // TODO: Replace with actual HTTP call
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    const index = this.mockPrograms.findIndex(p => p.programId === id);
    if (index !== -1) {
      this.mockPrograms.splice(index, 1);
    }
    return of(void 0);
  }

  getByDirectorate(directorateId: number): Observable<Program[]> {
    return of(this.mockPrograms.filter(p => p.directorateId === directorateId));
  }

  getByStatus(status: Program['status']): Observable<Program[]> {
    return of(this.mockPrograms.filter(p => p.status === status));
  }

  getActivePrograms(): Observable<Program[]> {
    return of(this.mockPrograms.filter(p => p.isActive));
  }

  getProgramStatistics(): Observable<any> {
    const programs = this.mockPrograms;
    const activePrograms = programs.filter(p => p.isActive);
    
    return of({
      totalPrograms: programs.length,
      activePrograms: activePrograms.length,
      totalBudget: programs.reduce((sum, p) => sum + p.budget, 0),
      totalSpent: programs.reduce((sum, p) => sum + p.actualSpent, 0),
      totalValue: programs.reduce((sum, p) => sum + p.valueGenerated, 0),
      totalRpaProjects: programs.reduce((sum, p) => sum + p.rpaProjectsCount, 0),
      averageProgress: programs.length > 0 ? programs.reduce((sum, p) => sum + p.progress, 0) / programs.length : 0,
      byStatus: {
        planning: programs.filter(p => p.status === 'Planning').length,
        active: programs.filter(p => p.status === 'Active').length,
        completed: programs.filter(p => p.status === 'Completed').length,
        onHold: programs.filter(p => p.status === 'On Hold').length
      },
      byDirectorate: this.getProgramsByDirectorateStats(programs)
    });
  }

  private getProgramsByDirectorateStats(programs: Program[]): any {
    return programs.reduce((acc, program) => {
      const directorate = program.directorate || 'Unknown';
      if (!acc[directorate]) {
        acc[directorate] = {
          count: 0,
          budget: 0,
          spent: 0,
          value: 0,
          rpaProjects: 0
        };
      }
      acc[directorate].count++;
      acc[directorate].budget += program.budget;
      acc[directorate].spent += program.actualSpent;
      acc[directorate].value += program.valueGenerated;
      acc[directorate].rpaProjects += program.rpaProjectsCount;
      return acc;
    }, {} as any);
  }

  // Update program progress
  updateProgress(id: number, progress: number): Observable<Program> {
    return this.update(id, { progress, updatedAt: new Date() });
  }

  // Add RPA project to program
  addRpaProject(programId: number, projectValue: number): Observable<Program> {
    const program = this.mockPrograms.find(p => p.programId === programId);
    if (program) {
      return this.update(programId, {
        rpaProjectsCount: program.rpaProjectsCount + 1,
        valueGenerated: program.valueGenerated + projectValue
      });
    }
    throw new Error('Program not found');
  }

  // Remove RPA project from program
  removeRpaProject(programId: number, projectValue: number): Observable<Program> {
    const program = this.mockPrograms.find(p => p.programId === programId);
    if (program) {
      return this.update(programId, {
        rpaProjectsCount: Math.max(0, program.rpaProjectsCount - 1),
        valueGenerated: Math.max(0, program.valueGenerated - projectValue)
      });
    }
    throw new Error('Program not found');
  }
}