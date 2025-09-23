import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CapabilityProgram } from '../models/capability-program.model';
import { MockDataService } from '../mock-data/mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class CapabilityDevelopmentService {
  private apiUrl = '/api/capability-development';

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  getAll(): Observable<CapabilityProgram[]> {
    // TODO: Replace with actual HTTP call when backend is ready
    // return this.http.get<CapabilityProgram[]>(this.apiUrl);
    return of(this.mockDataService.getCapabilityPrograms());
  }

  getById(id: number): Observable<CapabilityProgram | undefined> {
    // TODO: Replace with actual HTTP call
    // return this.http.get<CapabilityProgram>(`${this.apiUrl}/${id}`);
    return of(this.mockDataService.getCapabilityPrograms().find(p => p.programId === id));
  }

  create(program: Omit<CapabilityProgram, 'programId' | 'createdAt' | 'updatedAt'>): Observable<CapabilityProgram> {
    // TODO: Replace with actual HTTP call
    // return this.http.post<CapabilityProgram>(this.apiUrl, program);
    return of(this.mockDataService.createCapabilityProgram(program));
  }

  update(id: number, program: Partial<CapabilityProgram>): Observable<CapabilityProgram> {
    // TODO: Replace with actual HTTP call
    // return this.http.put<CapabilityProgram>(`${this.apiUrl}/${id}`, program);
    return of(this.mockDataService.updateCapabilityProgram(id, program));
  }

  delete(id: number): Observable<void> {
    // TODO: Replace with actual HTTP call
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(this.mockDataService.deleteCapabilityProgram(id));
  }

  getStatistics(): Observable<any> {
    // TODO: Replace with actual HTTP call
    const programs = this.mockDataService.getCapabilityPrograms();
    return of({
      totalPrograms: programs.length,
      staffDigitalMuscle: programs.filter(p => p.type === 'Staff Digital Muscle').length,
      onTheJobTraining: programs.filter(p => p.type === 'On-the-Job Training').length,
      ciIdeas: programs.filter(p => p.type === 'CI Ideas').length,
      trainingCompleted: programs.filter(p => p.type === 'Training Completed').length,
      trainingInProgress: programs.filter(p => p.type === 'Training In Progress').length,
      certifications: programs.filter(p => p.type === 'Certifications').length,
      byStatus: {
        completed: programs.filter(p => p.status === 'Completed').length,
        inProgress: programs.filter(p => p.status === 'In Progress').length,
        planned: programs.filter(p => p.status === 'Planned').length,
        onHold: programs.filter(p => p.status === 'On Hold').length
      }
    });
  }
}