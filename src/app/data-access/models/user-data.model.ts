import { UserRole } from "./role.model";
import { Team } from "./team.model";

export interface UserData {
personnelNumber: string;
companyNumber: string;
firstName: string;
lastName: string;
displayName: string;
emailAddress: string;
officePhone: string;
jobDescription: string;
isActive: boolean;
teamId: number;
createdAt: Date;
updatedAt: Date;
team?: Team;
roles?: UserRole[];
}