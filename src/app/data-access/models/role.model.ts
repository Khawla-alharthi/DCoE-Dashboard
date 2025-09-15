export interface Role {
roleId: number;
roleName: string;
}

export interface UserRole {
userRoleId: number;
personnelNumber: string;

roleId: number;
isActive: boolean;
assignedAt: Date;
role?: Role;
}