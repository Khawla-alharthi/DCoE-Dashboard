import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Program } from '../../models/program.model';
import { TeamActivity } from '../../models/team-activity.model';
import { IdeHighlight } from '../../models/ide-highlight.model';
import { RpaProject } from '../../models/rpa-project.model';

// Dashboard stats interface using existing models
export interface DashboardStats {
  totalProducts: number;
  valueGenerated: number;
  actualPercentage: number;
  externalEngagements: number;
  liveProcesses: number;
  inDevelopment: number;
  planned: number;
  manhourSavings: number;
  robots: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  getDashboardStats(): Observable<DashboardStats> {
    return of({
      totalProducts: 37,
      valueGenerated: 7970000,
      actualPercentage: 81,
      externalEngagements: 9,
      liveProcesses: 109,
      inDevelopment: 14,
      planned: 8,
      manhourSavings: 23300,
      robots: 4
    });
  }

  getDigitalPrograms(): Observable<Program[]> {
    return of([
      {
        programId: 1,
        programName: 'WAFI',
        phase: 'Industrialization',
        comments: 'Initial requirements gathering completed. Phase 4 kickoff planned for July.',
        status: 'On Track',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-01'),
        createdBy: 'system'
      },
      {
        programId: 2,
        programName: 'GCPO',
        phase: 'POC',
        comments: 'Project delivered. Field Testing and Support in progress.',
        status: 'Delayed by 20%',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-01'),
        createdBy: 'system'
      },
      {
        programId: 3,
        programName: 'RPA',
        phase: 'Scale',
        comments: 'Successfully launched 108 processes, and actively working on developing additional...',
        status: 'On Track',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-01'),
        createdBy: 'system'
      },
      {
        programId: 4,
        programName: 'ADAM',
        phase: 'MDP',
        comments: 'We have successfully rolled out two use cases, with end-user testing currently in pr...',
        status: 'On Track',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-01'),
        createdBy: 'system'
      },
      {
        programId: 5,
        programName: 'STEP',
        phase: 'Industrialized',
        comments: '361 well has been deployed',
        status: 'On Track',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-01'),
        createdBy: 'system'
      },
      {
        programId: 6,
        programName: 'Maintenance Domain',
        phase: 'POC',
        comments: 'We have successfully rolled out two use cases, with end-user testing currently in pr...',
        status: 'Delayed by 20%',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-01'),
        createdBy: 'system'
      },
      {
        programId: 7,
        programName: 'AI Task Force',
        phase: 'Kick-Off',
        comments: 'To be Kicked-Off',
        status: 'On Track',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-01'),
        createdBy: 'system'
      },
      {
        programId: 8,
        programName: 'Digital Muscle',
        phase: 'Scale',
        comments: '96 PDO Staff graduated with Digital Muscle Program',
        status: 'Delayed by 20%',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-01'),
        createdBy: 'system'
      }
    ]);
  }

  getTeamActivities(): Observable<TeamActivity[]> {
    return of([
      {
        activityId: 1,
        activityName: 'Team Breakfast',
        activityDate: new Date('2025-07-24'),
        status: 'In Progress',
        description: 'Monthly team building breakfast session',
        createdAt: new Date('2025-07-01'),
        updatedAt: new Date('2025-07-20'),
        createdBy: 'system',
        teamId: 8,
        team: { 
          teamId: 8,
          teamName: 'IDE 8',
          description: 'IDE Team 8',
          createdAt: new Date('2025-01-01'),
          directorateId: 1
        }
      },
      {
        activityId: 2,
        activityName: 'Team Breakfast',
        activityDate: new Date('2025-07-24'),
        status: 'In Progress',
        description: 'Monthly team building breakfast session',
        createdAt: new Date('2025-07-01'),
        updatedAt: new Date('2025-07-20'),
        createdBy: 'system',
        teamId: 4,
        team: { 
          teamId: 4,
          teamName: 'IDE 4',
          description: 'IDE Team 4',
          createdAt: new Date('2025-01-01'),
          directorateId: 1
        }
      },
      {
        activityId: 3,
        activityName: 'Team Breakfast',
        activityDate: new Date('2025-07-15'),
        status: 'Done',
        description: 'Monthly team building breakfast session',
        createdAt: new Date('2025-07-01'),
        updatedAt: new Date('2025-07-15'),
        createdBy: 'system',
        teamId: 3,
        team: { 
          teamId: 3,
          teamName: 'IDE 3',
          description: 'IDE Team 3',
          createdAt: new Date('2025-01-01'),
          directorateId: 1
        }
      }
    ]);
  }

  getIdeHighlights(): Observable<IdeHighlight[]> {
    return of([
      {
        highlightId: 1,
        highlightTitle: 'Knowledge-sharing session with OQ Sohar',
        description: 'Collaborative session focused on best practices and digital transformation strategies',
        highlightType: 'Knowledge Sharing',
        highlightDate: new Date('2025-08-15'),
        createdAt: new Date('2025-08-01'),
        createdBy: 'system'
      },
      {
        highlightId: 2,
        highlightTitle: 'Adam Scale-up',
        description: 'Scaling up the Adam automation platform to handle increased workload',
        highlightType: 'System Enhancement',
        highlightDate: new Date('2025-08-20'),
        createdAt: new Date('2025-08-01'),
        createdBy: 'system'
      },
      {
        highlightId: 3,
        highlightTitle: 'The World CIO 200 Summit',
        description: 'Participation in global CIO summit for digital innovation discussions',
        highlightType: 'External Event',
        highlightDate: new Date('2025-08-25'),
        createdAt: new Date('2025-08-01'),
        createdBy: 'system'
      },
      {
        highlightId: 4,
        highlightTitle: 'RPA contributions',
        description: 'Significant contributions to Robotic Process Automation initiatives',
        highlightType: 'Process Improvement',
        highlightDate: new Date('2025-08-30'),
        createdAt: new Date('2025-08-01'),
        createdBy: 'system'
      }
    ]);
  }

  getRpaProjects(): Observable<RpaProject[]> {
    return of([
      {
        projectId: 1,
        projectName: 'Automated Invoice Processing',
        projectType: 'Finance Automation',
        status: 'Production',
        robotsCount: 2,
        manhourSavings: 5000,
        valueGenerated: 1200000,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-01'),
        createdBy: 'system',
        directorateId: 1
      },
      {
        projectId: 2,
        projectName: 'HR Data Management',
        projectType: 'HR Automation',
        status: 'Development',
        robotsCount: 1,
        manhourSavings: 3000,
        valueGenerated: 800000,
        createdAt: new Date('2025-02-01'),
        updatedAt: new Date('2025-08-01'),
        createdBy: 'system',
        directorateId: 2
      }
    ]);
  }
}