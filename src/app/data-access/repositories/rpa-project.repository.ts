import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RpaProject } from '../models/rpa-project.model';
import { MockDataService } from '../mock-data/mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class RpaProjectService {
  private apiUrl = '/api/rpa-projects';

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  getAll(): Observable<RpaProject[]> {
    // TODO: Replace with actual HTTP call when backend is ready
    // return this.http.get<RpaProject[]>(this.apiUrl);
    return of(this.mockDataService.getRpaProjects());
  }

  getById(id: number): Observable<RpaProject | undefined> {
    // TODO: Replace with actual HTTP call
    // return this.http.get<RpaProject>(`${this.apiUrl}/${id}`);
    return of(this.mockDataService.getRpaProjects().find(p => p.projectId === id));
  }

  create(project: Omit<RpaProject, 'projectId' | 'createdAt' | 'updatedAt'>): Observable<RpaProject> {
    // TODO: Replace with actual HTTP call
    // return this.http.post<RpaProject>(this.apiUrl, project);
    return of(this.mockDataService.createRpaProject(project));
  }

  update(id: number, project: Partial<RpaProject>): Observable<RpaProject> {
    // TODO: Replace with actual HTTP call
    // return this.http.put<RpaProject>(`${this.apiUrl}/${id}`, project);
    return of(this.mockDataService.updateRpaProject(id, project));
  }

  delete(id: number): Observable<void> {
    // TODO: Replace with actual HTTP call
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(this.mockDataService.deleteRpaProject(id));
  }

  getByDirectorate(directorateId: number): Observable<RpaProject[]> {
    // TODO: Replace with actual HTTP call
    return of(this.mockDataService.getRpaProjects().filter(p => p.directorateId === directorateId));
  }

  getStatistics(): Observable<any> {
    // TODO: Replace with actual HTTP call
    const projects = this.mockDataService.getRpaProjects();
    return of({
      totalProjects: projects.length,
      totalValue: projects.reduce((sum, p) => sum + p.valueGenerated, 0),
      totalManhourSavings: projects.reduce((sum, p) => sum + p.manhourSavings, 0),
      totalRobots: projects.reduce((sum, p) => sum + p.robotsCount, 0),
      byStatus: {
        production: projects.filter(p => p.status === 'Production').length,
        development: projects.filter(p => p.status === 'Development').length,
        planning: projects.filter(p => p.status === 'Planning').length,
        underDiscussion: projects.filter(p => p.status === 'Under Discussion').length
      }
    });
  }
}

