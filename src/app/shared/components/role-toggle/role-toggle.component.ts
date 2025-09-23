import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../core/services/role.service';

@Component({
  selector: 'app-role-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center space-x-3">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Role:</span>
        <span 
          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
          [class]="roleService.getRoleColor()"
        >
          {{ roleService.getRoleDisplayName() }}
        </span>
      </div>
      
      <button
        (click)="switchRole()"
        class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        title="Switch Role (Demo)"
      >
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
        </svg>
        Switch
      </button>
      
      <div class="text-xs text-gray-500 dark:text-gray-400">
        <div class="font-medium">Permissions:</div>
        <div class="flex flex-wrap gap-1 mt-1">
          <span *ngIf="roleService.hasPermission('canCreate')" class="px-1 py-0.5 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded">Create</span>
          <span *ngIf="roleService.hasPermission('canUpdate')" class="px-1 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">Update</span>
          <span *ngIf="roleService.hasPermission('canDelete')" class="px-1 py-0.5 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded">Delete</span>
          <span *ngIf="roleService.hasPermission('canManageUsers')" class="px-1 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded">Manage Users</span>
        </div>
      </div>
    </div>
  `
})
export class RoleToggleComponent {
  public roleService = inject(RoleService);

  switchRole(): void {
    this.roleService.switchRole();
  }
}