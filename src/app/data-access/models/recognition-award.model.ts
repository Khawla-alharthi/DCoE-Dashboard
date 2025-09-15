import { Team } from "./team.model";
import { UserData } from "./user-data.model";

export interface RecognitionAward {
awardId: number;
awardTitle: string;
awardType: string;
description: string;
awardDate: Date;
createdAt: Date;
createdBy: string;
recipients?: RecognitionAwardRecipient[];
}

export interface RecognitionAwardRecipient {
awardId: number;
personnelNumber: string;
teamId: number;
user?: UserData;
team?: Team;
}