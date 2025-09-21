import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../core/services/role.service';

@Component({
  selector: 'app-role-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center space-x-3">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ roleService.getRoleDisplayName() }}
      </span>
      <button
        (click)="switchRole()"
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        [class]="roleService.isLeader() ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'"
        [attr.aria-label]="'Switch to ' + (roleService.isLeader() ? 'user' : 'leader') + ' role'"
      >
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          [class]="roleService.isLeader() ? 'translate-x-6' : 'translate-x-1'"
        ></span>
      </button>
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ roleService.isLeader() ? 'Leader Mode' : 'User Mode' }}
      </span>
    </div>
  `
})
export class RoleToggleComponent {
  public roleService = inject(RoleService);

  switchRole(): void {
    this.roleService.switchRole();
  }
}