import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { RecognitionAward, RecognitionAwardRecipient } from '../models/recognition-award.model';
import { UserData } from '../models/user-data.model';
import { Team } from '../models/team.model';

export interface AwardStatistics {
  totalAwards: number;
  awardsByType: { [type: string]: number };
  awardsByTeam: { [teamName: string]: number };
  totalRecipients: number;
  awardsThisMonth: number;
  topRecipients: { name: string; count: number }[];
}

export interface CreateAwardRequest {
  awardTitle: string;
  awardType: string;
  description: string;
  awardDate: Date;
  recipients: {
    personnelNumber: string;
    teamId: number;
  }[];
}

export interface UpdateAwardRequest {
  awardTitle?: string;
  awardType?: string;
  description?: string;
  awardDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RecognitionService {
  private awards: RecognitionAward[] = [
    {
      awardId: 1,
      awardTitle: 'Excellence in RPA Development',
      awardType: 'Technical Excellence',
      description: 'Outstanding contribution to RPA development with innovative automation solutions that saved over 1000 manhours',
      awardDate: new Date('2025-08-15'),
      createdAt: new Date('2025-08-10'),
      createdBy: 'Ahmed Al-Rashid'
    },
    {
      awardId: 2,
      awardTitle: 'Innovation Champion',
      awardType: 'Innovation',
      description: 'Pioneered the use of AI-driven process optimization leading to 25% efficiency improvement',
      awardDate: new Date('2025-07-20'),
      createdAt: new Date('2025-07-18'),
      createdBy: 'Ahmed Al-Rashid'
    },
    {
      awardId: 3,
      awardTitle: 'Team Collaboration Award',
      awardType: 'Teamwork',
      description: 'Exceptional teamwork in cross-functional project delivery, demonstrating outstanding collaboration skills',
      awardDate: new Date('2025-06-30'),
      createdAt: new Date('2025-06-25'),
      createdBy: 'Ahmed Al-Rashid'
    },
    {
      awardId: 4,
      awardTitle: 'Digital Transformation Leader',
      awardType: 'Leadership',
      description: 'Leading the digital transformation initiative across multiple directorates with remarkable success',
      awardDate: new Date('2025-05-15'),
      createdAt: new Date('2025-05-10'),
      createdBy: 'Ahmed Al-Rashid'
    },
    {
      awardId: 5,
      awardTitle: 'Customer Service Excellence',
      awardType: 'Service Excellence',
      description: 'Consistently delivering exceptional customer service and support to internal stakeholders',
      awardDate: new Date('2025-04-25'),
      createdAt: new Date('2025-04-20'),
      createdBy: 'Ahmed Al-Rashid'
    },
    {
      awardId: 6,
      awardTitle: 'Process Improvement Champion',
      awardType: 'Process Excellence',
      description: 'Identified and implemented process improvements that resulted in significant cost savings',
      awardDate: new Date('2025-03-10'),
      createdAt: new Date('2025-03-05'),
      createdBy: 'Ahmed Al-Rashid'
    }
  ];

  private awardRecipients: RecognitionAwardRecipient[] = [
    {
      awardId: 1,
      personnelNumber: '12002',
      teamId: 2,
      user: {
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
        updatedAt: new Date('2024-08-20')
      },
      team: { teamId: 2, teamName: 'IDE 2', description: 'Data analytics team', createdAt: new Date('2024-01-20'), directorateId: 2 }
    },
    {
      awardId: 1,
      personnelNumber: '12004',
      teamId: 2,
      user: {
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
        updatedAt: new Date('2024-08-10')
      },
      team: { teamId: 2, teamName: 'IDE 2', description: 'Data analytics team', createdAt: new Date('2024-01-20'), directorateId: 2 }
    },
    {
      awardId: 2,
      personnelNumber: '12003',
      teamId: 1,
      user: {
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
        updatedAt: new Date('2024-08-15')
      },
      team: { teamId: 1, teamName: 'IDE 1', description: 'Core automation team', createdAt: new Date('2024-01-15'), directorateId: 1 }
    },
    {
      awardId: 3,
      personnelNumber: '12005',
      teamId: 3,
      user: {
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
        updatedAt: new Date('2024-08-05')
      },
      team: { teamId: 3, teamName: 'IDE 3', description: 'Process automation team', createdAt: new Date('2024-02-01'), directorateId: 3 }
    },
    {
      awardId: 3,
      personnelNumber: '12006',
      teamId: 4,
      user: {
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
        updatedAt: new Date('2024-07-30')
      },
      team: { teamId: 4, teamName: 'IDE 4', description: 'AI initiatives team', createdAt: new Date('2024-02-15'), directorateId: 1 }
    },
    {
      awardId: 4,
      personnelNumber: '12007',
      teamId: 5,
      user: {
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
        updatedAt: new Date('2024-07-25')
      },
      team: { teamId: 5, teamName: 'IDE 5', description: 'Digital transformation team', createdAt: new Date('2024-03-01'), directorateId: 4 }
    }
  ];

  private awardTypes = [
    'Technical Excellence',
    'Innovation',
    'Leadership',
    'Teamwork',
    'Service Excellence',
    'Process Excellence',
    'Customer Focus',
    'Safety Excellence',
    'Environmental Stewardship',
    'Mentorship',
    'Knowledge Sharing',
    'Continuous Improvement'
  ];

  constructor() {}

  // Get all awards
  getAllAwards(): Observable<RecognitionAward[]> {
    const awardsWithRecipients = this.awards.map(award => ({
      ...award,
      recipients: this.awardRecipients.filter(r => r.awardId === award.awardId)
    }));

    return of(awardsWithRecipients).pipe(delay(500));
  }

  // Get award by ID
  getAwardById(awardId: number): Observable<RecognitionAward> {
    const award = this.awards.find(a => a.awardId === awardId);
    if (!award) {
      throw new Error('Award not found');
    }

    const awardWithRecipients = {
      ...award,
      recipients: this.awardRecipients.filter(r => r.awardId === awardId)
    };

    return of(awardWithRecipients).pipe(delay(300));
  }

  // Create new award
  createAward(request: CreateAwardRequest): Observable<RecognitionAward> {
    const newAwardId = Math.max(...this.awards.map(a => a.awardId)) + 1;
    
    const newAward: RecognitionAward = {
      awardId: newAwardId,
      awardTitle: request.awardTitle,
      awardType: request.awardType,
      description: request.description,
      awardDate: request.awardDate,
      createdAt: new Date(),
      createdBy: 'Current User' // In real app, get from auth service
    };

    this.awards.push(newAward);

    // Add recipients
    const recipients = request.recipients.map(recipient => ({
      awardId: newAwardId,
      personnelNumber: recipient.personnelNumber,
      teamId: recipient.teamId,
      // In real app, user and team data would be fetched
      user: undefined,
      team: undefined
    }));

    this.awardRecipients.push(...recipients);

    const awardWithRecipients = {
      ...newAward,
      recipients: this.awardRecipients.filter(r => r.awardId === newAwardId)
    };

    return of(awardWithRecipients).pipe(delay(800));
  }

  // Update award
  updateAward(awardId: number, request: UpdateAwardRequest): Observable<RecognitionAward> {
    const awardIndex = this.awards.findIndex(a => a.awardId === awardId);
    if (awardIndex === -1) {
      throw new Error('Award not found');
    }

    const updatedAward = {
      ...this.awards[awardIndex],
      ...request
    };

    this.awards[awardIndex] = updatedAward;

    const awardWithRecipients = {
      ...updatedAward,
      recipients: this.awardRecipients.filter(r => r.awardId === awardId)
    };

    return of(awardWithRecipients).pipe(delay(600));
  }

  // Delete award
  deleteAward(awardId: number): Observable<void> {
    const awardIndex = this.awards.findIndex(a => a.awardId === awardId);
    if (awardIndex === -1) {
      throw new Error('Award not found');
    }

    this.awards.splice(awardIndex, 1);
    
    // Remove all recipients for this award
    this.awardRecipients = this.awardRecipients.filter(r => r.awardId !== awardId);

    return of(void 0).pipe(delay(400));
  }

  // Get award recipients
  getAwardRecipients(awardId: number): Observable<RecognitionAwardRecipient[]> {
    const recipients = this.awardRecipients.filter(r => r.awardId === awardId);
    return of(recipients).pipe(delay(300));
  }

  // Add recipient to award
  addRecipient(awardId: number, personnelNumber: string, teamId: number): Observable<void> {
    // Check if recipient already exists
    const existingRecipient = this.awardRecipients.find(
      r => r.awardId === awardId && r.personnelNumber === personnelNumber
    );

    if (existingRecipient) {
      throw new Error('User is already a recipient of this award');
    }

    const newRecipient: RecognitionAwardRecipient = {
      awardId,
      personnelNumber,
      teamId
      // In real app, user and team data would be populated
    };

    this.awardRecipients.push(newRecipient);

    return of(void 0).pipe(delay(500));
  }

  // Remove recipient from award
  removeRecipient(awardId: number, personnelNumber: string): Observable<void> {
    this.awardRecipients = this.awardRecipients.filter(
      r => !(r.awardId === awardId && r.personnelNumber === personnelNumber)
    );

    return of(void 0).pipe(delay(400));
  }

  // Get awards by recipient
  getAwardsByRecipient(personnelNumber: string): Observable<RecognitionAward[]> {
    const recipientAwardIds = this.awardRecipients
      .filter(r => r.personnelNumber === personnelNumber)
      .map(r => r.awardId);

    const awards = this.awards.filter(a => recipientAwardIds.includes(a.awardId));

    return of(awards.map(award => ({
      ...award,
      recipients: this.awardRecipients.filter(r => r.awardId === award.awardId)
    }))).pipe(delay(400));
  }

  // Get awards by team
  getAwardsByTeam(teamId: number): Observable<RecognitionAward[]> {
    const teamAwardIds = this.awardRecipients
      .filter(r => r.teamId === teamId)
      .map(r => r.awardId);

    const uniqueAwardIds = [...new Set(teamAwardIds)];
    const awards = this.awards.filter(a => uniqueAwardIds.includes(a.awardId));

    return of(awards.map(award => ({
      ...award,
      recipients: this.awardRecipients.filter(r => r.awardId === award.awardId)
    }))).pipe(delay(400));
  }

  // Get awards by type
  getAwardsByType(awardType: string): Observable<RecognitionAward[]> {
    const awards = this.awards.filter(a => a.awardType === awardType);

    return of(awards.map(award => ({
      ...award,
      recipients: this.awardRecipients.filter(r => r.awardId === award.awardId)
    }))).pipe(delay(400));
  }

  // Get awards by date range
  getAwardsByDateRange(startDate: Date, endDate: Date): Observable<RecognitionAward[]> {
    const awards = this.awards.filter(a => 
      a.awardDate >= startDate && a.awardDate <= endDate
    );

    return of(awards.map(award => ({
      ...award,
      recipients: this.awardRecipients.filter(r => r.awardId === award.awardId)
    }))).pipe(delay(400));
  }

  // Search awards
  searchAwards(query: string): Observable<RecognitionAward[]> {
    const searchTerm = query.toLowerCase();
    const awards = this.awards.filter(award =>
      award.awardTitle.toLowerCase().includes(searchTerm) ||
      award.awardType.toLowerCase().includes(searchTerm) ||
      award.description.toLowerCase().includes(searchTerm) ||
      award.createdBy.toLowerCase().includes(searchTerm)
    );

    return of(awards.map(award => ({
      ...award,
      recipients: this.awardRecipients.filter(r => r.awardId === award.awardId)
    }))).pipe(delay(300));
  }

  // Get award statistics
  getStatistics(): Observable<AwardStatistics> {
    const thisMonth = new Date();
    thisMonth.setDate(1); // Start of current month
    
    const awardsThisMonth = this.awards.filter(a => a.awardDate >= thisMonth);
    
    const stats: AwardStatistics = {
      totalAwards: this.awards.length,
      awardsByType: {},
      awardsByTeam: {},
      totalRecipients: this.awardRecipients.length,
      awardsThisMonth: awardsThisMonth.length,
      topRecipients: []
    };

    // Count awards by type
    this.awards.forEach(award => {
      stats.awardsByType[award.awardType] = (stats.awardsByType[award.awardType] || 0) + 1;
    });

    // Count awards by team
    this.awardRecipients.forEach(recipient => {
      const teamName = recipient.team?.teamName || `Team ${recipient.teamId}`;
      stats.awardsByTeam[teamName] = (stats.awardsByTeam[teamName] || 0) + 1;
    });

    // Calculate top recipients
    const recipientCounts: { [personnelNumber: string]: { name: string; count: number } } = {};
    
    this.awardRecipients.forEach(recipient => {
      const name = recipient.user?.displayName || recipient.personnelNumber;
      if (recipientCounts[recipient.personnelNumber]) {
        recipientCounts[recipient.personnelNumber].count++;
      } else {
        recipientCounts[recipient.personnelNumber] = { name, count: 1 };
      }
    });

    stats.topRecipients = Object.values(recipientCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return of(stats).pipe(delay(400));
  }

  // Get available award types
  getAwardTypes(): Observable<string[]> {
    return of([...this.awardTypes]).pipe(delay(200));
  }

  // Get recent awards
  getRecentAwards(limit: number = 10): Observable<RecognitionAward[]> {
    const recentAwards = this.awards
      .sort((a, b) => b.awardDate.getTime() - a.awardDate.getTime())
      .slice(0, limit);

    return of(recentAwards.map(award => ({
      ...award,
      recipients: this.awardRecipients.filter(r => r.awardId === award.awardId)
    }))).pipe(delay(300));
  }

  // Get awards summary for dashboard
  getAwardsSummary(): Observable<any> {
    const summary = {
      totalAwards: this.awards.length,
      totalRecipients: this.awardRecipients.length,
      mostPopularType: '',
      recentAward: null as RecognitionAward | null
    };

    // Find most popular award type
    const typeCounts: { [type: string]: number } = {};
    this.awards.forEach(award => {
      typeCounts[award.awardType] = (typeCounts[award.awardType] || 0) + 1;
    });

    const sortedTypes = Object.entries(typeCounts).sort(([,a], [,b]) => b - a);
    summary.mostPopularType = sortedTypes[0]?.[0] || '';

    // Get most recent award
    const sortedAwards = this.awards.sort((a, b) => b.awardDate.getTime() - a.awardDate.getTime());
    summary.recentAward = sortedAwards[0] || null;

    return of(summary).pipe(delay(300));
  }
}