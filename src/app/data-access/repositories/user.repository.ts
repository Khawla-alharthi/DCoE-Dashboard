import { Injectable } from '@angular/core';
import { Observable, of, delay, forkJoin } from 'rxjs';
import { UserData } from '../models/user-data.model';
import { UserRole, Role } from '../models/role.model';
import { Team } from '../models/team.model';

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  usersByTeam: { [teamName: string]: number };
  usersByRole: { [roleName: string]: number };
  newUsersThisMonth: number;
}

export interface CreateUserRequest {
  companyNumber: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  officePhone: string;
  jobDescription: string;
  teamId: number;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  officePhone?: string;
  jobDescription?: string;
  teamId?: number;
  isActive?: boolean;
}

export interface AssignRoleRequest {
  personnelNumber: string;
  roleId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: UserData[] = [
    {
      personnelNumber: '12001',
      companyNumber: 'PDO12001',
      firstName: 'Ahmed',
      lastName: 'Al-Rashid',
      displayName: 'Ahmed Al-Rashid',
      emailAddress: 'ahmed.alrashid@pdo.co.om',
      officePhone: '+968-24567890',
      jobDescription: 'Senior RPA Developer & DCoE Leader',
      isActive: true,
      teamId: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-09-01'),
      team: { teamId: 1, teamName: 'IDE 1', description: 'Core automation team', createdAt: new Date('2024-01-15'), directorateId: 1 }
    },
    {
      personnelNumber: '12002',
      companyNumber: 'PDO12002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      displayName: 'Sarah Johnson',
      emailAddress: 'sarah.johnson@pdo.co.om',
      officePhone: '+968-24567891',
      jobDescription: 'RPA Developer',
      isActive: true,
      teamId: 2,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-08-20'),
      team: { teamId: 2, teamName: 'IDE 2', description: 'Data analytics team', createdAt: new Date('2024-01-20'), directorateId: 2 }
    },
    {
      personnelNumber: '12003',
      companyNumber: 'PDO12003',
      firstName: 'Fatima',
      lastName: 'Al-Zahra',
      displayName: 'Fatima Al-Zahra',
      emailAddress: 'fatima.alzahra@pdo.co.om',
      officePhone: '+968-24567892',
      jobDescription: 'Process Analyst',
      isActive: true,
      teamId: 1,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-08-15'),
      team: { teamId: 1, teamName: 'IDE 1', description: 'Core automation team', createdAt: new Date('2024-01-15'), directorateId: 1 }
    },
    {
      personnelNumber: '12004',
      companyNumber: 'PDO12004',
      firstName: 'Mohammed',
      lastName: 'Al-Balushi',
      displayName: 'Mohammed Al-Balushi',
      emailAddress: 'mohammed.albalushi@pdo.co.om',
      officePhone: '+968-24567893',
      jobDescription: 'Data Scientist',
      isActive: true,
      teamId: 2,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-08-10'),
      team: { teamId: 2, teamName: 'IDE 2', description: 'Data analytics team', createdAt: new Date('2024-01-20'), directorateId: 2 }
    },
    {
      personnelNumber: '12005',
      companyNumber: 'PDO12005',
      firstName: 'Aisha',
      lastName: 'Al-Hinai',
      displayName: 'Aisha Al-Hinai',
      emailAddress: 'aisha.alhinai@pdo.co.om',
      officePhone: '+968-24567894',
      jobDescription: 'Business Process Manager',
      isActive: true,
      teamId: 3,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-08-05'),
      team: { teamId: 3, teamName: 'IDE 3', description: 'Process automation team', createdAt: new Date('2024-02-01'), directorateId: 3 }
    },
    {
      personnelNumber: '12006',
      companyNumber: 'PDO12006',
      firstName: 'Omar',
      lastName: 'Al-Kindi',
      displayName: 'Omar Al-Kindi',
      emailAddress: 'omar.alkindi@pdo.co.om',
      officePhone: '+968-24567895',
      jobDescription: 'Software Developer',
      isActive: true,
      teamId: 4,
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2024-07-30'),
      team: { teamId: 4, teamName: 'IDE 4', description: 'AI initiatives team', createdAt: new Date('2024-02-15'), directorateId: 1 }
    },
    {
      personnelNumber: '12007',
      companyNumber: 'PDO12007',
      firstName: 'Mariam',
      lastName: 'Al-Rashdi',
      displayName: 'Mariam Al-Rashdi',
      emailAddress: 'mariam.alrashdi@pdo.co.om',
      officePhone: '+968-24567896',
      jobDescription: 'Digital Strategy Consultant',
      isActive: true,
      teamId: 5,
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-07-25'),
      team: { teamId: 5, teamName: 'IDE 5', description: 'Digital transformation team', createdAt: new Date('2024-03-01'), directorateId: 4 }
    },
    {
      personnelNumber: '12008',
      companyNumber: 'PDO12008',
      firstName: 'Khalid',
      lastName: 'Al-Mamari',
      displayName: 'Khalid Al-Mamari',
      emailAddress: 'khalid.almamari@pdo.co.om',
      officePhone: '+968-24567897',
      jobDescription: 'Cybersecurity Specialist',
      isActive: false,
      teamId: 6,
      createdAt: new Date('2024-04-15'),
      updatedAt: new Date('2024-07-20'),
      team: { teamId: 6, teamName: 'IDE 6', description: 'Security and governance team', createdAt: new Date('2024-03-15'), directorateId: 2 }
    },
    {
      personnelNumber: '12009',
      companyNumber: 'PDO12009',
      firstName: 'Layla',
      lastName: 'Al-Busaidi',
      displayName: 'Layla Al-Busaidi',
      emailAddress: 'layla.albusaidi@pdo.co.om',
      officePhone: '+968-24567898',
      jobDescription: 'UX/UI Designer',
      isActive: true,
      teamId: 7,
      createdAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-08-01'),
      team: { teamId: 7, teamName: 'IDE 7', description: 'Cloud infrastructure team', createdAt: new Date('2024-04-01'), directorateId: 2 }
    },
    {
      personnelNumber: '12010',
      companyNumber: 'PDO12010',
      firstName: 'Yusuf',
      lastName: 'Al-Ghassani',
      displayName: 'Yusuf Al-Ghassani',
      emailAddress: 'yusuf.alghassani@pdo.co.om',
      officePhone: '+968-24567899',
      jobDescription: 'Cloud Architect',
      isActive: true,
      teamId: 8,
      createdAt: new Date('2024-05-15'),
      updatedAt: new Date('2024-07-15'),
      team: { teamId: 8, teamName: 'IDE 8', description: 'User experience team', createdAt: new Date('2024-04-15'), directorateId: 5 }
    },
    {
      personnelNumber: '12011',
      companyNumber: 'PDO12011',
      firstName: 'Noor',
      lastName: 'Al-Salti',
      displayName: 'Noor Al-Salti',
      emailAddress: 'noor.alsalti@pdo.co.om',
      officePhone: '+968-24567800',
      jobDescription: 'Machine Learning Engineer',
      isActive: true,
      teamId: 4,
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-08-10'),
      team: { teamId: 4, teamName: 'IDE 4', description: 'AI initiatives team', createdAt: new Date('2024-02-15'), directorateId: 1 }
    },
    {
      personnelNumber: '12012',
      companyNumber: 'PDO12012',
      firstName: 'Hassan',
      lastName: 'Al-Wahaibi',
      displayName: 'Hassan Al-Wahaibi',
      emailAddress: 'hassan.alwahaibi@pdo.co.om',
      officePhone: '+968-24567801',
      jobDescription: 'DevOps Engineer',
      isActive: true,
      teamId: 7,
      createdAt: new Date('2024-06-15'),
      updatedAt: new Date('2024-07-10'),
      team: { teamId: 7, teamName: 'IDE 7', description: 'Cloud infrastructure team', createdAt: new Date('2024-04-01'), directorateId: 2 }
    }
  ];

  private roles: Role[] = [
    { roleId: 1, roleName: 'DCoE Leader' },
    { roleId: 2, roleName: 'RPA Developer' },
    { roleId: 3, roleName: 'Process Analyst' },
    { roleId: 4, roleName: 'Data Scientist' },
    { roleId: 5, roleName: 'Business Analyst' },
    { roleId: 6, roleName: 'Software Developer' },
    { roleId: 7, roleName: 'Project Manager' },
    { roleId: 8, roleName: 'Team Lead' },
    { roleId: 9, roleName: 'UX/UI Designer' },
    { roleId: 10, roleName: 'Cloud Architect' },
    { roleId: 11, roleName: 'Machine Learning Engineer' },
    { roleId: 12, roleName: 'DevOps Engineer' },
    { roleId: 13, roleName: 'Cybersecurity Specialist' },
    { roleId: 14, roleName: 'Digital Strategy Consultant' }
  ];

  private userRoles: UserRole[] = [
    {
      userRoleId: 1,
      personnelNumber: '12001',
      roleId: 1,
      isActive: true,
      assignedAt: new Date('2024-01-15'),
      role: { roleId: 1, roleName: 'DCoE Leader' }
    },
    {
      userRoleId: 2,
      personnelNumber: '12001',
      roleId: 2,
      isActive: true,
      assignedAt: new Date('2024-01-15'),
      role: { roleId: 2, roleName: 'RPA Developer' }
    },
    {
      userRoleId: 3,
      personnelNumber: '12002',
      roleId: 2,
      isActive: true,
      assignedAt: new Date('2024-01-20'),
      role: { roleId: 2, roleName: 'RPA Developer' }
    },
    {
      userRoleId: 4,
      personnelNumber: '12003',
      roleId: 3,
      isActive: true,
      assignedAt: new Date('2024-02-01'),
      role: { roleId: 3, roleName: 'Process Analyst' }
    },
    {
      userRoleId: 5,
      personnelNumber: '12004',
      roleId: 4,
      isActive: true,
      assignedAt: new Date('2024-02-15'),
      role: { roleId: 4, roleName: 'Data Scientist' }
    },
    {
      userRoleId: 6,
      personnelNumber: '12005',
      roleId: 5,
      isActive: true,
      assignedAt: new Date('2024-03-01'),
      role: { roleId: 5, roleName: 'Business Analyst' }
    },
    {
      userRoleId: 7,
      personnelNumber: '12005',
      roleId: 7,
      isActive: true,
      assignedAt: new Date('2024-03-01'),
      role: { roleId: 7, roleName: 'Project Manager' }
    },
    {
      userRoleId: 8,
      personnelNumber: '12006',
      roleId: 6,
      isActive: true,
      assignedAt: new Date('2024-03-15'),
      role: { roleId: 6, roleName: 'Software Developer' }
    },
    {
      userRoleId: 9,
      personnelNumber: '12007',
      roleId: 14,
      isActive: true,
      assignedAt: new Date('2024-04-01'),
      role: { roleId: 14, roleName: 'Digital Strategy Consultant' }
    },
    {
      userRoleId: 10,
      personnelNumber: '12008',
      roleId: 13,
      isActive: false,
      assignedAt: new Date('2024-04-15'),
      role: { roleId: 13, roleName: 'Cybersecurity Specialist' }
    },
    {
      userRoleId: 11,
      personnelNumber: '12009',
      roleId: 9,
      isActive: true,
      assignedAt: new Date('2024-05-01'),
      role: { roleId: 9, roleName: 'UX/UI Designer' }
    },
    {
      userRoleId: 12,
      personnelNumber: '12010',
      roleId: 10,
      isActive: true,
      assignedAt: new Date('2024-05-15'),
      role: { roleId: 10, roleName: 'Cloud Architect' }
    },
    {
      userRoleId: 13,
      personnelNumber: '12011',
      roleId: 11,
      isActive: true,
      assignedAt: new Date('2024-06-01'),
      role: { roleId: 11, roleName: 'Machine Learning Engineer' }
    },
    {
      userRoleId: 14,
      personnelNumber: '12012',
      roleId: 12,
      isActive: true,
      assignedAt: new Date('2024-06-15'),
      role: { roleId: 12, roleName: 'DevOps Engineer' }
    }
  ];

  constructor() {
    // Attach roles to users on initialization
    this.attachRolesToUsers();
  }

  private attachRolesToUsers(): void {
    this.users = this.users.map(user => ({
      ...user,
      roles: this.userRoles.filter(ur => ur.personnelNumber === user.personnelNumber && ur.isActive)
    }));
  }

  // Get all users
  getAllUsers(): Observable<UserData[]> {
    this.attachRolesToUsers();
    return of([...this.users]).pipe(delay(500));
  }

  // Get user by personnel number
  getUserById(personnelNumber: string): Observable<UserData> {
    const user = this.users.find(u => u.personnelNumber === personnelNumber);
    if (!user) {
      throw new Error('User not found');
    }

    const userWithRoles = {
      ...user,
      roles: this.userRoles.filter(ur => ur.personnelNumber === personnelNumber && ur.isActive)
    };

    return of(userWithRoles).pipe(delay(300));
  }

  // Create new user
  createUser(request: CreateUserRequest): Observable<UserData> {
    const personnelNumber = this.generatePersonnelNumber();
    const newUser: UserData = {
      personnelNumber,
      companyNumber: request.companyNumber,
      firstName: request.firstName,
      lastName: request.lastName,
      displayName: `${request.firstName} ${request.lastName}`,
      emailAddress: request.emailAddress,
      officePhone: request.officePhone,
      jobDescription: request.jobDescription,
      isActive: true,
      teamId: request.teamId,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: []
    };

    // Add team info (in real app, would be fetched)
    const teamMap: { [id: number]: Team } = {
      1: { teamId: 1, teamName: 'IDE 1', description: 'Core automation team', createdAt: new Date('2024-01-15'), directorateId: 1 },
      2: { teamId: 2, teamName: 'IDE 2', description: 'Data analytics team', createdAt: new Date('2024-01-20'), directorateId: 2 },
      3: { teamId: 3, teamName: 'IDE 3', description: 'Process automation team', createdAt: new Date('2024-02-01'), directorateId: 3 },
      4: { teamId: 4, teamName: 'IDE 4', description: 'AI initiatives team', createdAt: new Date('2024-02-15'), directorateId: 1 },
      5: { teamId: 5, teamName: 'IDE 5', description: 'Digital transformation team', createdAt: new Date('2024-03-01'), directorateId: 4 },
      6: { teamId: 6, teamName: 'IDE 6', description: 'Security and governance team', createdAt: new Date('2024-03-15'), directorateId: 2 },
      7: { teamId: 7, teamName: 'IDE 7', description: 'Cloud infrastructure team', createdAt: new Date('2024-04-01'), directorateId: 2 },
      8: { teamId: 8, teamName: 'IDE 8', description: 'User experience team', createdAt: new Date('2024-04-15'), directorateId: 5 }
    };

    newUser.team = teamMap[request.teamId];
    this.users.push(newUser);

    return of(newUser).pipe(delay(800));
  }

  // Update user
  updateUser(personnelNumber: string, request: UpdateUserRequest): Observable<UserData> {
    const userIndex = this.users.findIndex(u => u.personnelNumber === personnelNumber);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...request,
      updatedAt: new Date()
    };

    if (request.firstName || request.lastName) {
      updatedUser.displayName = `${updatedUser.firstName} ${updatedUser.lastName}`;
    }

    // Update team info if changed
    if (request.teamId && request.teamId !== this.users[userIndex].teamId) {
      const teamMap: { [id: number]: Team } = {
        1: { teamId: 1, teamName: 'IDE 1', description: 'Core automation team', createdAt: new Date('2024-01-15'), directorateId: 1 },
        2: { teamId: 2, teamName: 'IDE 2', description: 'Data analytics team', createdAt: new Date('2024-01-20'), directorateId: 2 },
        3: { teamId: 3, teamName: 'IDE 3', description: 'Process automation team', createdAt: new Date('2024-02-01'), directorateId: 3 },
        4: { teamId: 4, teamName: 'IDE 4', description: 'AI initiatives team', createdAt: new Date('2024-02-15'), directorateId: 1 },
        5: { teamId: 5, teamName: 'IDE 5', description: 'Digital transformation team', createdAt: new Date('2024-03-01'), directorateId: 4 },
        6: { teamId: 6, teamName: 'IDE 6', description: 'Security and governance team', createdAt: new Date('2024-03-15'), directorateId: 2 },
        7: { teamId: 7, teamName: 'IDE 7', description: 'Cloud infrastructure team', createdAt: new Date('2024-04-01'), directorateId: 2 },
        8: { teamId: 8, teamName: 'IDE 8', description: 'User experience team', createdAt: new Date('2024-04-15'), directorateId: 5 }
      };
      updatedUser.team = teamMap[request.teamId];
    }

    this.users[userIndex] = updatedUser;
    updatedUser.roles = this.userRoles.filter(ur => ur.personnelNumber === personnelNumber && ur.isActive);

    return of(updatedUser).pipe(delay(600));
  }

  // Delete user (deactivate)
  deleteUser(personnelNumber: string): Observable<void> {
    const userIndex = this.users.findIndex(u => u.personnelNumber === personnelNumber);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Deactivate instead of deleting
    this.users[userIndex].isActive = false;
    this.users[userIndex].updatedAt = new Date();

    // Deactivate all user roles
    this.userRoles
      .filter(ur => ur.personnelNumber === personnelNumber)
      .forEach(ur => ur.isActive = false);

    return of(void 0).pipe(delay(500));
  }

  // Assign role to user
  assignRole(request: AssignRoleRequest): Observable<void> {
    const user = this.users.find(u => u.personnelNumber === request.personnelNumber);
    if (!user) {
      throw new Error('User not found');
    }

    const role = this.roles.find(r => r.roleId === request.roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Check if user already has this role
    const existingUserRole = this.userRoles.find(
      ur => ur.personnelNumber === request.personnelNumber && ur.roleId === request.roleId
    );

    if (existingUserRole) {
      existingUserRole.isActive = true;
      existingUserRole.assignedAt = new Date();
    } else {
      const newUserRole: UserRole = {
        userRoleId: Math.max(...this.userRoles.map(ur => ur.userRoleId)) + 1,
        personnelNumber: request.personnelNumber,
        roleId: request.roleId,
        isActive: true,
        assignedAt: new Date(),
        role
      };
      this.userRoles.push(newUserRole);
    }

    return of(void 0).pipe(delay(600));
  }

  // Remove role from user
  removeRole(personnelNumber: string, roleId: number): Observable<void> {
    const userRole = this.userRoles.find(
      ur => ur.personnelNumber === personnelNumber && ur.roleId === roleId
    );

    if (userRole) {
      userRole.isActive = false;
    }

    return of(void 0).pipe(delay(400));
  }

  // Get users by team
  getUsersByTeam(teamId: number): Observable<UserData[]> {
    const teamUsers = this.users.filter(u => u.teamId === teamId && u.isActive);
    this.attachRolesToUsers();
    
    return of(teamUsers.map(user => ({
      ...user,
      roles: this.userRoles.filter(ur => ur.personnelNumber === user.personnelNumber && ur.isActive)
    }))).pipe(delay(400));
  }

  // Get users by role
  getUsersByRole(roleId: number): Observable<UserData[]> {
    const roleUserIds = this.userRoles
      .filter(ur => ur.roleId === roleId && ur.isActive)
      .map(ur => ur.personnelNumber);

    const roleUsers = this.users.filter(u => roleUserIds.includes(u.personnelNumber) && u.isActive);
    
    return of(roleUsers.map(user => ({
      ...user,
      roles: this.userRoles.filter(ur => ur.personnelNumber === user.personnelNumber && ur.isActive)
    }))).pipe(delay(400));
  }

  // Search users
  searchUsers(query: string): Observable<UserData[]> {
    const searchTerm = query.toLowerCase();
    const filteredUsers = this.users.filter(user =>
      user.displayName.toLowerCase().includes(searchTerm) ||
      user.emailAddress.toLowerCase().includes(searchTerm) ||
      user.jobDescription.toLowerCase().includes(searchTerm) ||
      user.personnelNumber.includes(searchTerm) ||
      user.team?.teamName.toLowerCase().includes(searchTerm)
    );

    this.attachRolesToUsers();
    return of(filteredUsers).pipe(delay(300));
  }

  // Get user statistics
  getStatistics(): Observable<UserStatistics> {
    const activeUsers = this.users.filter(u => u.isActive);
    const newUsersThisMonth = this.users.filter(u => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return u.createdAt > monthAgo;
    });

    const stats: UserStatistics = {
      totalUsers: this.users.length,
      activeUsers: activeUsers.length,
      usersByTeam: {},
      usersByRole: {},
      newUsersThisMonth: newUsersThisMonth.length
    };

    // Count users by team
    activeUsers.forEach(user => {
      const teamName = user.team?.teamName || 'Unassigned';
      stats.usersByTeam[teamName] = (stats.usersByTeam[teamName] || 0) + 1;
    });

    // Count users by role
    const activeUserRoles = this.userRoles.filter(ur => ur.isActive);
    activeUserRoles.forEach(userRole => {
      const roleName = userRole.role?.roleName || 'Unknown';
      stats.usersByRole[roleName] = (stats.usersByRole[roleName] || 0) + 1;
    });

    return of(stats).pipe(delay(400));
  }

  // Get available roles
  getRoles(): Observable<Role[]> {
    return of([...this.roles]).pipe(delay(200));
  }

  // Get available teams (for dropdowns)
  getTeams(): Observable<Team[]> {
    const teams: Team[] = [
      { teamId: 1, teamName: 'IDE 1', description: 'Core automation team', createdAt: new Date('2024-01-15'), directorateId: 1 },
      { teamId: 2, teamName: 'IDE 2', description: 'Data analytics team', createdAt: new Date('2024-01-20'), directorateId: 2 },
      { teamId: 3, teamName: 'IDE 3', description: 'Process automation team', createdAt: new Date('2024-02-01'), directorateId: 3 },
      { teamId: 4, teamName: 'IDE 4', description: 'AI initiatives team', createdAt: new Date('2024-02-15'), directorateId: 1 },
      { teamId: 5, teamName: 'IDE 5', description: 'Digital transformation team', createdAt: new Date('2024-03-01'), directorateId: 4 },
      { teamId: 6, teamName: 'IDE 6', description: 'Security and governance team', createdAt: new Date('2024-03-15'), directorateId: 2 },
      { teamId: 7, teamName: 'IDE 7', description: 'Cloud infrastructure team', createdAt: new Date('2024-04-01'), directorateId: 2 },
      { teamId: 8, teamName: 'IDE 8', description: 'User experience team', createdAt: new Date('2024-04-15'), directorateId: 5 }
    ];

    return of(teams).pipe(delay(200));
  }

  // Generate personnel number
  private generatePersonnelNumber(): string {
    const existingNumbers = this.users.map(u => parseInt(u.personnelNumber));
    const maxNumber = Math.max(...existingNumbers);
    return (maxNumber + 1).toString();
  }

  // Activate user
  activateUser(personnelNumber: string): Observable<void> {
    const user = this.users.find(u => u.personnelNumber === personnelNumber);
    if (user) {
      user.isActive = true;
      user.updatedAt = new Date();
    }
    return of(void 0).pipe(delay(400));
  }

  // Get user activity/audit log (placeholder)
  getUserActivity(personnelNumber: string): Observable<any[]> {
    // In real app, this would fetch user activity log
    const mockActivity = [
      {
        id: 1,
        action: 'Login',
        timestamp: new Date('2025-09-13T08:30:00'),
        details: 'User logged in successfully',
        ipAddress: '192.168.1.100'
      },
      {
        id: 2,
        action: 'Role Assignment',
        timestamp: new Date('2025-09-12T14:15:00'),
        details: 'Assigned role: RPA Developer',
        performedBy: 'Ahmed Al-Rashid'
      },
      {
        id: 3,
        action: 'Profile Update',
        timestamp: new Date('2025-09-10T11:20:00'),
        details: 'Updated job description',
        performedBy: personnelNumber
      },
      {
        id: 4,
        action: 'Team Assignment',
        timestamp: new Date('2025-09-08T09:45:00'),
        details: 'Assigned to IDE 2 team',
        performedBy: 'Ahmed Al-Rashid'
      },
      {
        id: 5,
        action: 'Password Change',
        timestamp: new Date('2025-09-05T16:30:00'),
        details: 'User changed password',
        performedBy: personnelNumber
      }
    ];

    return of(mockActivity).pipe(delay(300));
  }

  // Get users with specific role
  getUsersWithRole(roleName: string): Observable<UserData[]> {
    const role = this.roles.find(r => r.roleName === roleName);
    if (!role) {
      return of([]);
    }

    const userIds = this.userRoles
      .filter(ur => ur.roleId === role.roleId && ur.isActive)
      .map(ur => ur.personnelNumber);

    const usersWithRole = this.users.filter(u => userIds.includes(u.personnelNumber) && u.isActive);
    
    return of(usersWithRole.map(user => ({
      ...user,
      roles: this.userRoles.filter(ur => ur.personnelNumber === user.personnelNumber && ur.isActive)
    }))).pipe(delay(300));
  }

  // Get user's role history
  getUserRoleHistory(personnelNumber: string): Observable<UserRole[]> {
    const userRoleHistory = this.userRoles
      .filter(ur => ur.personnelNumber === personnelNumber)
      .sort((a, b) => b.assignedAt.getTime() - a.assignedAt.getTime());

    return of(userRoleHistory).pipe(delay(300));
  }

  // Bulk update users
  bulkUpdateUsers(updates: { personnelNumber: string; updates: UpdateUserRequest }[]): Observable<UserData[]> {
    const updatedUsers: UserData[] = [];

    updates.forEach(({ personnelNumber, updates: userUpdates }) => {
      const userIndex = this.users.findIndex(u => u.personnelNumber === personnelNumber);
      if (userIndex !== -1) {
        const updatedUser = {
          ...this.users[userIndex],
          ...userUpdates,
          updatedAt: new Date()
        };

        if (userUpdates.firstName || userUpdates.lastName) {
          updatedUser.displayName = `${updatedUser.firstName} ${updatedUser.lastName}`;
        }

        this.users[userIndex] = updatedUser;
        updatedUsers.push(updatedUser);
      }
    });

    return of(updatedUsers).pipe(delay(800));
  }

  // Get team leaders
  getTeamLeaders(): Observable<UserData[]> {
    const leaderRoleIds = [1, 8]; // DCoE Leader and Team Lead
    const leaderUserIds = this.userRoles
      .filter(ur => leaderRoleIds.includes(ur.roleId) && ur.isActive)
      .map(ur => ur.personnelNumber);

    const uniqueLeaderIds = [...new Set(leaderUserIds)];
    const leaders = this.users.filter(u => uniqueLeaderIds.includes(u.personnelNumber) && u.isActive);

    return of(leaders.map(user => ({
      ...user,
      roles: this.userRoles.filter(ur => ur.personnelNumber === user.personnelNumber && ur.isActive)
    }))).pipe(delay(300));
  }

  // Get users by directorate (through team)
  getUsersByDirectorate(directorateId: number): Observable<UserData[]> {
    const directorateUsers = this.users.filter(u => 
      u.team?.directorateId === directorateId && u.isActive
    );

    return of(directorateUsers.map(user => ({
      ...user,
      roles: this.userRoles.filter(ur => ur.personnelNumber === user.personnelNumber && ur.isActive)
    }))).pipe(delay(400));
  }

  // Export users data
  exportUsers(format: 'csv' | 'excel' = 'csv'): Observable<any> {
    // In real app, this would generate and return file data
    const exportData = this.users.map(user => ({
      personnelNumber: user.personnelNumber,
      companyNumber: user.companyNumber,
      displayName: user.displayName,
      emailAddress: user.emailAddress,
      jobDescription: user.jobDescription,
      teamName: user.team?.teamName || 'Unassigned',
      isActive: user.isActive ? 'Active' : 'Inactive',
      roles: this.userRoles
        .filter(ur => ur.personnelNumber === user.personnelNumber && ur.isActive)
        .map(ur => ur.role?.roleName)
        .join(', '),
      createdAt: user.createdAt.toISOString().split('T')[0],
      updatedAt: user.updatedAt.toISOString().split('T')[0]
    }));

    return of({
      data: exportData,
      filename: `users_export_${new Date().toISOString().split('T')[0]}.${format}`,
      format
    }).pipe(delay(1000));
  }

  // Import users data
  importUsers(userData: any[]): Observable<{ success: number; errors: any[] }> {
    let successCount = 0;
    const errors: any[] = [];

    userData.forEach((data, index) => {
      try {
        if (!data.firstName || !data.lastName || !data.emailAddress || !data.companyNumber) {
          errors.push({
            row: index + 1,
            error: 'Missing required fields: firstName, lastName, emailAddress, or companyNumber'
          });
          return;
        }

        const personnelNumber = this.generatePersonnelNumber();
        const newUser: UserData = {
          personnelNumber,
          companyNumber: data.companyNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: `${data.firstName} ${data.lastName}`,
          emailAddress: data.emailAddress,
          officePhone: data.officePhone || '',
          jobDescription: data.jobDescription || '',
          isActive: true,
          teamId: data.teamId || 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          roles: []
        };

        this.users.push(newUser);
        successCount++;
      } catch (error) {
        errors.push({
          row: index + 1,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    return of({ success: successCount, errors }).pipe(delay(1500));
  }

  // Get user dashboard data
  getUserDashboard(personnelNumber: string): Observable<any> {
    const user = this.users.find(u => u.personnelNumber === personnelNumber);
    if (!user) {
      throw new Error('User not found');
    }

    const userRoles = this.userRoles.filter(ur => ur.personnelNumber === personnelNumber && ur.isActive);
    const recentActivity = [
      {
        action: 'Updated profile',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        details: 'Changed job description'
      },
      {
        action: 'Role assigned',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        details: 'Assigned RPA Developer role'
      }
    ];

    const dashboardData = {
      user: {
        ...user,
        roles: userRoles
      },
      stats: {
        totalRoles: userRoles.length,
        accountAge: Math.floor((new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
        lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        profileCompleteness: this.calculateProfileCompleteness(user)
      },
      recentActivity,
      teamMembers: this.users.filter(u => u.teamId === user.teamId && u.personnelNumber !== personnelNumber).length
    };

    return of(dashboardData).pipe(delay(400));
  }

  // Calculate profile completeness percentage
  private calculateProfileCompleteness(user: UserData): number {
    let completeness = 0;
    const fields = [
      user.firstName,
      user.lastName,
      user.emailAddress,
      user.jobDescription,
      user.officePhone,
      user.team,
    ];

    fields.forEach(field => {
      if (field && field.toString().trim()) {
        completeness += 16.67; // 100% / 6 fields
      }
    });

    return Math.round(completeness);
  }

  // Validate user data
  validateUserData(userData: Partial<UserData>): Observable<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (userData.emailAddress) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.emailAddress)) {
        errors.push('Invalid email address format');
      }

      // Check for duplicate email
      const existingUser = this.users.find(u => 
        u.emailAddress === userData.emailAddress && 
        u.personnelNumber !== userData.personnelNumber
      );
      if (existingUser) {
        errors.push('Email address already exists');
      }
    }

    if (userData.companyNumber) {
      // Check for duplicate company number
      const existingUser = this.users.find(u => 
        u.companyNumber === userData.companyNumber && 
        u.personnelNumber !== userData.personnelNumber
      );
      if (existingUser) {
        errors.push('Company number already exists');
      }
    }

    if (userData.officePhone) {
      const phoneRegex = /^\+?\d{8,15}$/;
      if (!phoneRegex.test(userData.officePhone.replace(/[\s-]/g, ''))) {
        errors.push('Invalid phone number format');
      }
    }

    return of({
      isValid: errors.length === 0,
      errors
    }).pipe(delay(200));
  }

  // Get user permissions
  getUserPermissions(personnelNumber: string): Observable<string[]> {
    const user = this.users.find(u => u.personnelNumber === personnelNumber);
    if (!user || !user.isActive) {
      return of([]);
    }

    const userRoles = this.userRoles.filter(ur => ur.personnelNumber === personnelNumber && ur.isActive);
    const permissions: string[] = [];

    userRoles.forEach(userRole => {
      switch (userRole.roleId) {
        case 1: // DCoE Leader
          permissions.push('all_permissions', 'manage_users', 'manage_teams', 'manage_projects', 'view_analytics');
          break;
        case 2: // RPA Developer
          permissions.push('create_projects', 'edit_projects', 'view_projects');
          break;
        case 3: // Process Analyst
          permissions.push('analyze_processes', 'create_reports', 'view_projects');
          break;
        case 7: // Project Manager
          permissions.push('manage_projects', 'assign_tasks', 'view_analytics');
          break;
        case 8: // Team Lead
          permissions.push('manage_team', 'assign_roles', 'view_team_analytics');
          break;
        default:
          permissions.push('view_dashboard');
      }
    });

    return of([...new Set(permissions)]).pipe(delay(200));
  }
}