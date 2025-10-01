import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { IdeHighlight, IdeHighlightRecipient } from '../models/ide-highlight.model';
import { UserData } from '../models/user-data.model';
import { Team } from '../models/team.model';

export interface HighlightStatistics {
  totalHighlights: number;
  highlightsByType: { [type: string]: number };
  highlightsByTeam: { [teamName: string]: number };
  totalRecipients: number;
  highlightsThisMonth: number;
  topContributors: { name: string; count: number }[];
}

export interface CreateHighlightRequest {
  highlightTitle: string;
  highlightType: string;
  description: string;
  highlightDate: Date;
  recipients: {
    personnelNumber: string;
    teamId: number;
  }[];
}

export interface UpdateHighlightRequest {
  highlightTitle?: string;
  highlightType?: string;
  description?: string;
  highlightDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HighlightsService {
  private highlights: IdeHighlight[] = [
    {
      highlightId: 1,
      highlightTitle: 'Knowledge-sharing session with OQ Sohar',
      highlightType: 'Knowledge Sharing',
      description: 'Collaborative session focused on best practices and digital transformation strategies. The team shared insights on RPA implementation and process optimization techniques with OQ Sohar, fostering knowledge transfer and building stronger partnerships across organizations.',
      highlightDate: new Date('2025-08-15'),
      createdAt: new Date('2025-08-10'),
      createdBy: 'Ahmed Al-Rashid'
    },
    {
      highlightId: 2,
      highlightTitle: 'Adam Scale-up Implementation',
      highlightType: 'System Enhancement',
      description: 'Successfully scaled up the Adam automation platform to handle increased workload and improved system performance by 40%. This enhancement allows for processing 3x more transactions while maintaining reliability and reducing response times.',
      highlightDate: new Date('2025-08-20'),
      createdAt: new Date('2025-08-18'),
      createdBy: 'Sarah Johnson'
    },
    {
      highlightId: 3,
      highlightTitle: 'The World CIO 200 Summit Participation',
      highlightType: 'External Event',
      description: 'PDO DCoE team participated in the prestigious World CIO 200 Summit, representing the company in global discussions on digital innovation. The team presented our RPA success stories and learned about emerging technologies and best practices from industry leaders.',
      highlightDate: new Date('2025-08-25'),
      createdAt: new Date('2025-08-22'),
      createdBy: 'Mariam Al-Rashdi'
    },
    {
      highlightId: 4,
      highlightTitle: 'RPA Contributions Milestone',
      highlightType: 'Process Improvement',
      description: 'Achieved significant milestone in RPA contributions with over $2M in cost savings and 15,000 manhours saved across various business processes. The team successfully deployed 25 automation solutions this quarter.',
      highlightDate: new Date('2025-08-30'),
      createdAt: new Date('2025-08-28'),
      createdBy: 'Mohammed Al-Balushi'
    },
    {
      highlightId: 5,
      highlightTitle: 'AI Integration Workshop Series',
      highlightType: 'Training & Development',
      description: 'Conducted comprehensive AI integration workshop series for 150+ employees across different directorates. The workshops covered machine learning basics, AI use cases in oil & gas industry, and hands-on training with AI tools.',
      highlightDate: new Date('2025-07-10'),
      createdAt: new Date('2025-07-08'),
      createdBy: 'Omar Al-Kindi'
    },
    {
      highlightId: 6,
      highlightTitle: 'Digital Excellence Award Recognition',
      highlightType: 'Achievement',
      description: 'DCoE team received the Digital Excellence Award from PDO leadership for outstanding contribution to digital transformation initiatives. This recognition highlights the team\'s dedication and innovative approach to solving business challenges.',
      highlightDate: new Date('2025-06-20'),
      createdAt: new Date('2025-06-18'),
      createdBy: 'Aisha Al-Hinai'
    },
    {
      highlightId: 7,
      highlightTitle: 'Cross-Directorate Collaboration Initiative',
      highlightType: 'Collaboration',
      description: 'Launched successful cross-directorate collaboration initiative resulting in 5 joint automation projects. This initiative improved communication, reduced duplicate efforts, and created synergies across different business units.',
      highlightDate: new Date('2025-05-15'),
      createdAt: new Date('2025-05-12'),
      createdBy: 'Fatima Al-Zahra'
    },
    {
      highlightId: 8,
      highlightTitle: 'Sustainability Through Automation',
      highlightType: 'Sustainability',
      description: 'Implemented green automation solutions that reduced paper consumption by 80% and energy usage by 25% across automated processes. This initiative aligns with PDO\'s sustainability goals and environmental commitments.',
      highlightDate: new Date('2025-04-30'),
      createdAt: new Date('2025-04-28'),
      createdBy: 'Khalid Al-Mamari'
    }
  ];

  private highlightRecipients: IdeHighlightRecipient[] = [
    {
      highlightId: 1,
      personnelNumber: '12001',
      teamId: 1,
      user: {
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
        updatedAt: new Date('2024-09-01')
      },
      team: { teamId: 1, teamName: 'IDE 1', description: 'Core automation team', createdAt: new Date('2024-01-15'), directorateId: 1 }
    },
    {
      highlightId: 1,
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
      highlightId: 2,
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
      highlightId: 3,
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
    },
    {
      highlightId: 4,
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
      highlightId: 5,
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
    }
  ];

  private highlightTypes = [
    'Knowledge Sharing',
    'System Enhancement',
    'External Event',
    'Process Improvement',
    'Training & Development',
    'Achievement',
    'Collaboration',
    'Innovation',
    'Sustainability',
    'Research & Development',
    'Community Engagement',
    'Technology Adoption'
  ];

  constructor() {}

  // Get all highlights
  getAllHighlights(): Observable<IdeHighlight[]> {
    const highlightsWithRecipients = this.highlights.map(highlight => ({
      ...highlight,
      recipients: this.highlightRecipients.filter(r => r.highlightId === highlight.highlightId)
    }));

    return of(highlightsWithRecipients).pipe(delay(500));
  }

  // Get highlight by ID
  getHighlightById(highlightId: number): Observable<IdeHighlight> {
    const highlight = this.highlights.find(h => h.highlightId === highlightId);
    if (!highlight) {
      throw new Error('Highlight not found');
    }

    const highlightWithRecipients = {
      ...highlight,
      recipients: this.highlightRecipients.filter(r => r.highlightId === highlightId)
    };

    return of(highlightWithRecipients).pipe(delay(300));
  }

  // Create new highlight
  createHighlight(request: CreateHighlightRequest): Observable<IdeHighlight> {
    const newHighlightId = Math.max(...this.highlights.map(h => h.highlightId)) + 1;
    
    const newHighlight: IdeHighlight = {
      highlightId: newHighlightId,
      highlightTitle: request.highlightTitle,
      highlightType: request.highlightType,
      description: request.description,
      highlightDate: request.highlightDate,
      createdAt: new Date(),
      createdBy: 'Current User' // In real app, get from auth service
    };

    this.highlights.push(newHighlight);

    // Add recipients
    const recipients = request.recipients.map(recipient => ({
      highlightId: newHighlightId,
      personnelNumber: recipient.personnelNumber,
      teamId: recipient.teamId,
      // In real app, user and team data would be fetched
      user: undefined,
      team: undefined
    }));

    this.highlightRecipients.push(...recipients);

    const highlightWithRecipients = {
      ...newHighlight,
      recipients: this.highlightRecipients.filter(r => r.highlightId === newHighlightId)
    };

    return of(highlightWithRecipients).pipe(delay(800));
  }

  // Update highlight
  updateHighlight(highlightId: number, request: UpdateHighlightRequest): Observable<IdeHighlight> {
    const highlightIndex = this.highlights.findIndex(h => h.highlightId === highlightId);
    if (highlightIndex === -1) {
      throw new Error('Highlight not found');
    }

    const updatedHighlight = {
      ...this.highlights[highlightIndex],
      ...request
    };

    this.highlights[highlightIndex] = updatedHighlight;

    const highlightWithRecipients = {
      ...updatedHighlight,
      recipients: this.highlightRecipients.filter(r => r.highlightId === highlightId)
    };

    return of(highlightWithRecipients).pipe(delay(600));
  }

  // Delete highlight
  deleteHighlight(highlightId: number): Observable<void> {
    const highlightIndex = this.highlights.findIndex(h => h.highlightId === highlightId);
    if (highlightIndex === -1) {
      throw new Error('Highlight not found');
    }

    this.highlights.splice(highlightIndex, 1);
    
    // Remove all recipients for this highlight
    this.highlightRecipients = this.highlightRecipients.filter(r => r.highlightId !== highlightId);

    return of(void 0).pipe(delay(400));
  }

  // Get highlights by date range
  getHighlightsByDateRange(startDate: Date, endDate: Date): Observable<IdeHighlight[]> {
    const highlights = this.highlights.filter(h => 
      h.highlightDate >= startDate && h.highlightDate <= endDate
    );

    return of(highlights.map(highlight => ({
      ...highlight,
      recipients: this.highlightRecipients.filter(r => r.highlightId === highlight.highlightId)
    }))).pipe(delay(400));
  }

  // Get highlights by type
  getHighlightsByType(highlightType: string): Observable<IdeHighlight[]> {
    const highlights = this.highlights.filter(h => h.highlightType === highlightType);

    return of(highlights.map(highlight => ({
      ...highlight,
      recipients: this.highlightRecipients.filter(r => r.highlightId === highlight.highlightId)
    }))).pipe(delay(400));
  }

  // Get highlights by recipient
  getHighlightsByRecipient(personnelNumber: string): Observable<IdeHighlight[]> {
    const recipientHighlightIds = this.highlightRecipients
      .filter(r => r.personnelNumber === personnelNumber)
      .map(r => r.highlightId);

    const highlights = this.highlights.filter(h => recipientHighlightIds.includes(h.highlightId));

    return of(highlights.map(highlight => ({
      ...highlight,
      recipients: this.highlightRecipients.filter(r => r.highlightId === highlight.highlightId)
    }))).pipe(delay(400));
  }

  // Get highlights by team
  getHighlightsByTeam(teamId: number): Observable<IdeHighlight[]> {
    const teamHighlightIds = this.highlightRecipients
      .filter(r => r.teamId === teamId)
      .map(r => r.highlightId);

    const uniqueHighlightIds = [...new Set(teamHighlightIds)];
    const highlights = this.highlights.filter(h => uniqueHighlightIds.includes(h.highlightId));

    return of(highlights.map(highlight => ({
      ...highlight,
      recipients: this.highlightRecipients.filter(r => r.highlightId === highlight.highlightId)
    }))).pipe(delay(400));
  }

  // Search highlights
  searchHighlights(query: string): Observable<IdeHighlight[]> {
    const searchTerm = query.toLowerCase();
    const highlights = this.highlights.filter(highlight =>
      highlight.highlightTitle.toLowerCase().includes(searchTerm) ||
      highlight.highlightType.toLowerCase().includes(searchTerm) ||
      highlight.description.toLowerCase().includes(searchTerm) ||
      highlight.createdBy.toLowerCase().includes(searchTerm)
    );

    return of(highlights.map(highlight => ({
      ...highlight,
      recipients: this.highlightRecipients.filter(r => r.highlightId === highlight.highlightId)
    }))).pipe(delay(300));
  }

  // Get recent highlights
  getRecentHighlights(limit: number = 10): Observable<IdeHighlight[]> {
    const recentHighlights = this.highlights
      .sort((a, b) => b.highlightDate.getTime() - a.highlightDate.getTime())
      .slice(0, limit);

    return of(recentHighlights.map(highlight => ({
      ...highlight,
      recipients: this.highlightRecipients.filter(r => r.highlightId === highlight.highlightId)
    }))).pipe(delay(300));
  }

  // Get highlight statistics
  getStatistics(): Observable<HighlightStatistics> {
    const thisMonth = new Date();
    thisMonth.setDate(1); // Start of current month
    
    const highlightsThisMonth = this.highlights.filter(h => h.highlightDate >= thisMonth);
    
    const stats: HighlightStatistics = {
      totalHighlights: this.highlights.length,
      highlightsByType: {},
      highlightsByTeam: {},
      totalRecipients: this.highlightRecipients.length,
      highlightsThisMonth: highlightsThisMonth.length,
      topContributors: []
    };

    // Count highlights by type
    this.highlights.forEach(highlight => {
      stats.highlightsByType[highlight.highlightType] = (stats.highlightsByType[highlight.highlightType] || 0) + 1;
    });

    // Count highlights by team
    this.highlightRecipients.forEach(recipient => {
      const teamName = recipient.team?.teamName || `Team ${recipient.teamId}`;
      stats.highlightsByTeam[teamName] = (stats.highlightsByTeam[teamName] || 0) + 1;
    });

    // Calculate top contributors (recipients with most highlights)
    const contributorCounts: { [personnelNumber: string]: { name: string; count: number } } = {};
    
    this.highlightRecipients.forEach(recipient => {
      const name = recipient.user?.displayName || recipient.personnelNumber;
      if (contributorCounts[recipient.personnelNumber]) {
        contributorCounts[recipient.personnelNumber].count++;
      } else {
        contributorCounts[recipient.personnelNumber] = { name, count: 1 };
      }
    });

    stats.topContributors = Object.values(contributorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return of(stats).pipe(delay(400));
  }

  // Get available highlight types
  getHighlightTypes(): Observable<string[]> {
    return of([...this.highlightTypes]).pipe(delay(200));
  }

  // Get highlight timeline data for visualization
  getTimelineData(): Observable<any[]> {
    const timelineData = this.highlights.map(highlight => ({
      id: highlight.highlightId,
      title: highlight.highlightTitle,
      type: highlight.highlightType,
      date: highlight.highlightDate,
      description: highlight.description,
      recipientCount: this.highlightRecipients.filter(r => r.highlightId === highlight.highlightId).length
    })).sort((a, b) => b.date.getTime() - a.date.getTime());

    return of(timelineData).pipe(delay(300));
  }

  // Get highlights summary for dashboard
  getHighlightsSummary(): Observable<any> {
    const summary = {
      totalHighlights: this.highlights.length,
      totalRecipients: this.highlightRecipients.length,
      mostPopularType: '',
      recentHighlight: null as IdeHighlight | null,
      monthlyTrend: [] as any[]
    };

    // Find most popular highlight type
    const typeCounts: { [type: string]: number } = {};
    this.highlights.forEach(highlight => {
      typeCounts[highlight.highlightType] = (typeCounts[highlight.highlightType] || 0) + 1;
    });

    const sortedTypes = Object.entries(typeCounts).sort(([,a], [,b]) => b - a);
    summary.mostPopularType = sortedTypes[0]?.[0] || '';

    // Get most recent highlight
    const sortedHighlights = this.highlights.sort((a, b) => b.highlightDate.getTime() - a.highlightDate.getTime());
    summary.recentHighlight = sortedHighlights[0] || null;

    // Generate monthly trend data for the last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthHighlights = this.highlights.filter(h => 
        h.highlightDate >= month && h.highlightDate < nextMonth
      );

      summary.monthlyTrend.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count: monthHighlights.length
      });
    }

    return of(summary).pipe(delay(300));
  }

  // Add recipient to highlight
  addRecipient(highlightId: number, personnelNumber: string, teamId: number): Observable<void> {
    // Check if recipient already exists
    const existingRecipient = this.highlightRecipients.find(
      r => r.highlightId === highlightId && r.personnelNumber === personnelNumber
    );

    if (existingRecipient) {
      throw new Error('User is already a recipient of this highlight');
    }

    const newRecipient: IdeHighlightRecipient = {
      highlightId,
      personnelNumber,
      teamId
      // In real app, user and team data would be populated
    };

    this.highlightRecipients.push(newRecipient);

    return of(void 0).pipe(delay(500));
  }

  // Remove recipient from highlight
  removeRecipient(highlightId: number, personnelNumber: string): Observable<void> {
    this.highlightRecipients = this.highlightRecipients.filter(
      r => !(r.highlightId === highlightId && r.personnelNumber === personnelNumber)
    );

    return of(void 0).pipe(delay(400));
  }
}