import { Team } from "./team.model";

export interface Directorate {
directorateId: number;
name: string;
code: string;
description: string;
createdAt: Date;
teams?: Team[];
}