import { Directorate } from "./directorate.model";
import { UserData } from "./user-data.model";

export interface Team {
teamId: number;
teamName: string;
description: string;
createdAt: Date;
directorateId: number;
directorate?: Directorate;
members?: UserData[];
}