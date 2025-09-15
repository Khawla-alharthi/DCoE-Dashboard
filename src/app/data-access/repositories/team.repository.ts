import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Team } from '../models/team.model';
import { UserData } from '../models/user-data.model';
import { Directorate } from '../models/directorate.model';

export interface TeamStatistics {
  totalTeams: number;
  totalMembers: number;
  averageTeamSize: number;
  teamsByDirectorate: { [key: string]: number };
  activeTeams: number;
}

export interface CreateTeamRequest {
  teamName: string;
  description: string;
  directorateId: number;
}

export interface UpdateTeamRequest {
  teamName?: string;
  description?: string;
  directorateId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teams: Team[] = [
    {
      teamId: 1,
      teamName: 'IDE 1',
      description: 'Intelligent Digital Enterprise Team 1 - Core automation and process optimization',
      createdAt: new Date('2024-01-15'),
      directorateId: 1,
      directorate: { directorateId: 1, name: 'Upstream', code: 'UPS', description: 'Upstream Operations', createdAt: new Date('2023-01-01') },
      members: []
    },
    {
      teamId: 2,
      teamName: 'IDE 2',
      description: 'Intelligent Digital Enterprise Team 2 - Data analytics and visualization',
      createdAt: new Date('2024-01-20'),
      directorateId: 2,
      directorate: { directorateId: 2, name: 'IT', code: 'IT', description: 'Information Technology', createdAt: new Date('2023-01-01') },
      members: []
    },
    {
      teamId: 3,
      teamName: 'IDE 3',
      description: 'Intelligent Digital Enterprise Team 3 - Process automation and RPA',
      createdAt: new Date('2024-02-01'),
      directorateId: 3,
      directorate: { directorateId: 3, name: 'Operations', code: 'OPS', description: 'Field Operations', createdAt: new Date('2023-01-01') },
      members: []
    },
    {
      teamId: 4,
      teamName: 'IDE 4',
      description: 'Intelligent Digital Enterprise Team 4 - Machine learning and AI initiatives',
      createdAt: new Date('2024-02-15'),
      directorateId: 1,
      directorate: { directorateId: 1, name: 'Upstream', code: 'UPS', description: 'Upstream Operations', createdAt: new Date('2023-01-01') },
      members: []
    },
    {
      teamId: 5,
      teamName: 'IDE 5',
      description: 'Intelligent Digital Enterprise Team 5 - Digital transformation and strategy',
      createdAt: new Date('2024-03-01'),
      directorateId: 4,
      directorate: { directorateId: 4, name: 'Finance', code: 'FIN', description: 'Finance and Commercial', createdAt: new Date('2023-01-01') },
      members: []
    },
    {
      teamId: 6,
      teamName: 'IDE 6',
      description: 'Intelligent Digital Enterprise Team 6 - Cybersecurity and governance',
      createdAt: new Date('2024-03-15'),
      directorateId: 2,
      directorate: { directorateId: 2, name: 'IT', code: 'IT', description: 'Information Technology', createdAt: new Date('2023-01-01') },
      members: []
    },
    {
      teamId: 7,
      teamName: 'IDE 7',
      description: 'Intelligent Digital Enterprise Team 7 - Cloud infrastructure and DevOps',
      createdAt: new Date('2024-04-01'),
      directorateId: 2,
      directorate: { directorateId: 2, name: 'IT', code: 'IT', description: 'Information Technology', createdAt: new Date('2023-01-01') },
      members: []
    },
    {
      teamId: 8,
      teamName: 'IDE 8',
      description: 'Intelligent Digital Enterprise Team 8 - User experience and digital adoption',
      createdAt: new Date('2024-04-15'),
      directorateId: 5,
      directorate: { directorateId: 5, name: 'People & Culture', code: 'P&C', description: 'Human Resources and Culture', createdAt: new Date('2023-01-01') },
      members: []
    }
  ];

  private teamMembers: { [teamId: number]: UserData[] } = {
    1: [
      {
        personnelNumber: '12001',
        companyNumber: 'PDO12001',
        firstName: 'Ahmed',
        lastName: 'Al-Rashid',
        displayName: 'Ahmed Al-Rashid',
        emailAddress: 'ahmed.alrashid@pdo.co.om',
        officePhone: '+968-24567890',
        jobDescription: 'Senior RPA Developer',
        isActive: true,
        teamId: 1,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-09-01')
      },
      {
        personnelNumber: '12002',
        companyNumber: 'PDO12002',
        firstName: 'Fatima',
        lastName: 'Al-Zahra',
        displayName: 'Fatima Al-Zahra',
        emailAddress: 'fatima.alzahra@pdo.co.om',
        officePhone: '+968-24567891',
        jobDescription: 'Process Analyst',
        isActive: true,
        teamId: 1,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-08-15')
      }
    ],
    2: [
      {
        personnelNumber: '12003',
        companyNumber: 'PDO12003',
        firstName: 'Sarah',
        lastName: 'Johnson',
        displayName: 'Sarah Johnson',
        emailAddress: 'sarah.johnson@pdo.co.om',
        officePhone: '+968-24567892',
        jobDescription: 'Data Analyst',
        isActive: true,
        teamId: 2,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-08-20')
      }
    ]
  };

  constructor() {}

  // Get all teams
  getAll(): Observable<Team[]> {
    return of(this.teams.map(team => ({
      ...team,
      members: this.teamMembers[team.teamId] || []
    }))).pipe(delay(500));
  }

  // Get team by ID
  getById(teamId: number): Observable<Team> {
    const team = this.teams.find(t => t.teamId === teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    
    const teamWithMembers = {
      ...team,
      members: this.teamMembers[teamId] || []
    };
    
    return of(teamWithMembers).pipe(delay(300));
  }

  // Create new team
  create(request: CreateTeamRequest): Observable<Team> {
    const newTeam: Team = {
      teamId: Math.max(...this.teams.map(t => t.teamId)) + 1,
      teamName: request.teamName,
      description: request.description,
      directorateId: request.directorateId,
      createdAt: new Date(),
      members: []
    };

    // Add directorate info (in real app, this would be fetched)
    const directorateMap: { [id: number]: Directorate } = {
      1: { directorateId: 1, name: 'Upstream', code: 'UPS', description: 'Upstream Operations', createdAt: new Date('2023-01-01') },
      2: { directorateId: 2, name: 'IT', code: 'IT', description: 'Information Technology', createdAt: new Date('2023-01-01') },
      3: { directorateId: 3, name: 'Operations', code: 'OPS', description: 'Field Operations', createdAt: new Date('2023-01-01') },
      4: { directorateId: 4, name: 'Finance', code: 'FIN', description: 'Finance and Commercial', createdAt: new Date('2023-01-01') },
      5: { directorateId: 5, name: 'People & Culture', code: 'P&C', description: 'Human Resources and Culture', createdAt: new Date('2023-01-01') }
    };

    newTeam.directorate = directorateMap[request.directorateId];
    this.teams.push(newTeam);
    this.teamMembers[newTeam.teamId] = [];

    return of(newTeam).pipe(delay(800));
  }

  // Update team
  update(teamId: number, request: UpdateTeamRequest): Observable<Team> {
    const teamIndex = this.teams.findIndex(t => t.teamId === teamId);
    if (teamIndex === -1) {
      throw new Error('Team not found');
    }

    const updatedTeam = {
      ...this.teams[teamIndex],
      ...request
    };

    // Update directorate if changed
    if (request.directorateId && request.directorateId !== this.teams[teamIndex].directorateId) {
      const directorateMap: { [id: number]: Directorate } = {
        1: { directorateId: 1, name: 'Upstream', code: 'UPS', description: 'Upstream Operations', createdAt: new Date('2023-01-01') },
        2: { directorateId: 2, name: 'IT', code: 'IT', description: 'Information Technology', createdAt: new Date('2023-01-01') },
        3: { directorateId: 3, name: 'Operations', code: 'OPS', description: 'Field Operations', createdAt: new Date('2023-01-01') },
        4: { directorateId: 4, name: 'Finance', code: 'FIN', description: 'Finance and Commercial', createdAt: new Date('2023-01-01') },
        5: { directorateId: 5, name: 'People & Culture', code: 'P&C', description: 'Human Resources and Culture', createdAt: new Date('2023-01-01') }
      };
      updatedTeam.directorate = directorateMap[request.directorateId];
    }

    this.teams[teamIndex] = updatedTeam;
    updatedTeam.members = this.teamMembers[teamId] || [];

    return of(updatedTeam).pipe(delay(600));
  }

  // Delete team
  delete(teamId: number): Observable<void> {
    const teamIndex = this.teams.findIndex(t => t.teamId === teamId);
    if (teamIndex === -1) {
      throw new Error('Team not found');
    }

    this.teams.splice(teamIndex, 1);
    delete this.teamMembers[teamId];

    return of(void 0).pipe(delay(400));
  }

  // Get team members
  getTeamMembers(teamId: number): Observable<UserData[]> {
    const members = this.teamMembers[teamId] || [];
    return of(members).pipe(delay(300));
  }

  // Add member to team
  addMember(teamId: number, personnelNumber: string): Observable<void> {
    // In real app, this would move user from one team to another
    // For now, just simulate success
    return of(void 0).pipe(delay(500));
  }

  // Remove member from team
  removeMember(teamId: number, personnelNumber: string): Observable<void> {
    if (this.teamMembers[teamId]) {
      this.teamMembers[teamId] = this.teamMembers[teamId].filter(
        m => m.personnelNumber !== personnelNumber
      );
    }
    return of(void 0).pipe(delay(400));
  }

  // Get team statistics
  getStatistics(): Observable<TeamStatistics> {
    const stats: TeamStatistics = {
      totalTeams: this.teams.length,
      totalMembers: Object.values(this.teamMembers).reduce((sum, members) => sum + members.length, 0),
      averageTeamSize: 0,
      teamsByDirectorate: {},
      activeTeams: this.teams.length
    };

    stats.averageTeamSize = stats.totalTeams > 0 ? Math.round(stats.totalMembers / stats.totalTeams * 10) / 10 : 0;

    // Count teams by directorate
    this.teams.forEach(team => {
      const directorateName = team.directorate?.name || 'Unknown';
      stats.teamsByDirectorate[directorateName] = (stats.teamsByDirectorate[directorateName] || 0) + 1;
    });

    return of(stats).pipe(delay(400));
  }

  // Get teams by directorate
  getByDirectorate(directorateId: number): Observable<Team[]> {
    const teams = this.teams.filter(t => t.directorateId === directorateId);
    return of(teams.map(team => ({
      ...team,
      members: this.teamMembers[team.teamId] || []
    }))).pipe(delay(300));
  }

  // Search teams
  search(query: string): Observable<Team[]> {
    const searchTerm = query.toLowerCase();
    const filteredTeams = this.teams.filter(team =>
      team.teamName.toLowerCase().includes(searchTerm) ||
      team.description.toLowerCase().includes(searchTerm) ||
      team.directorate?.name.toLowerCase().includes(searchTerm)
    );

    return of(filteredTeams.map(team => ({
      ...team,
      members: this.teamMembers[team.teamId] || []
    }))).pipe(delay(300));
  }

  // Get available directorates (for form dropdowns)
  getDirectorates(): Observable<Directorate[]> {
    const directorates: Directorate[] = [
      { directorateId: 1, name: 'Upstream', code: 'UPS', description: 'Upstream Operations', createdAt: new Date('2023-01-01') },
      { directorateId: 2, name: 'IT', code: 'IT', description: 'Information Technology', createdAt: new Date('2023-01-01') },
      { directorateId: 3, name: 'Operations', code: 'OPS', description: 'Field Operations', createdAt: new Date('2023-01-01') },
      { directorateId: 4, name: 'Finance', code: 'FIN', description: 'Finance and Commercial', createdAt: new Date('2023-01-01') },
      { directorateId: 5, name: 'People & Culture', code: 'P&C', description: 'Human Resources and Culture', createdAt: new Date('2023-01-01') }
    ];

    return of(directorates).pipe(delay(200));
  }
}