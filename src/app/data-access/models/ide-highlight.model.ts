import { Team } from "./team.model";
import { UserData } from "./user-data.model";

export interface IdeHighlight {
highlightId: number;
highlightTitle: string;
highlightType: string;
description: string;
highlightDate: Date;
createdAt: Date;
createdBy: string;
recipients?: IdeHighlightRecipient[];
}

export interface IdeHighlightRecipient {
highlightId: number;
personnelNumber: string;
teamId: number;
user?: UserData;
team?: Team;
}