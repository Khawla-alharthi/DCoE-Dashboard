import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'badge' | 'action';
  badgeConfig?: {
    [key: string]: { class: string; label?: string };
  };
}

export interface TableAction {
  label: string;
  icon?: string;
  class?: string;
  action: (item: any) => void;
  visible?: (item: any) => boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card overflow-hidden">
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ title }}</h3>
          
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearch()"
                placeholder="Search..."
                class="input-field pl-10 w-64"
              >
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            
            <!-- Add Button -->
            <button 
              *ngIf="showAddButton"
              (click)="onAdd()"
              class="btn-primary"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Add {{ entityName }}
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                *ngFor="let column of columns"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                [style.width]="column.width"
                (click)="onSort(column.key)"
              >
                <div class="flex items-center">
                  {{ column.label }}
                  <svg 
                    *ngIf="column.sortable && sortColumn === column.key"
                    class="w-4 h-4 ml-1"
                    [ngClass]="sortDirection === 'asc' ? '' : 'rotate-180'"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                </div>
              </th>
              <th *ngIf="actions?.length" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              *ngFor="let item of paginatedData; let i = index"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              (click)="onRowClick(item)"
            >
              <td 
                *ngFor="let column of columns"
                class="px-6 py-4 whitespace-nowrap"
              >
                <ng-container [ngSwitch]="column.type || 'text'">
                  <!-- Text -->
                  <span *ngSwitchCase="'text'" class="text-sm text-gray-900 dark:text-gray-100">
                    {{ getValue(item, column.key) }}
                  </span>
                  
                  <!-- Number -->
                  <span *ngSwitchCase="'number'" class="text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {{ getValue(item, column.key) | number }}
                  </span>
                  
                  <!-- Date -->
                  <span *ngSwitchCase="'date'" class="text-sm text-gray-900 dark:text-gray-100">
                    {{ getValue(item, column.key) | date:'short' }}
                  </span>
                  
                  <!-- Badge -->
                  <span 
                    *ngSwitchCase="'badge'"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    [ngClass]="getBadgeClass(column, getValue(item, column.key))"
                  >
                    {{ getBadgeLabel(column, getValue(item, column.key)) }}
                  </span>
                </ng-container>
              </td>
              
              <!-- Actions -->
              <td *ngIf="actions?.length" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    *ngFor="let action of getVisibleActions(item)"
                    (click)="$event.stopPropagation(); action.action(item)"
                    [class]="action.class || 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'"
                    class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    [title]="action.label"
                  >
                    <span *ngIf="action.icon" [innerHTML]="action.icon" class="w-4 h-4"></span>
                    <span *ngIf="!action.icon">{{ action.label }}</span>
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr *ngIf="paginatedData.length === 0">
              <td [attr.colspan]="columns.length + (actions?.length ? 1 : 0)" class="px-6 py-12 text-center">
                <div class="text-gray-500 dark:text-gray-400">
                  <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p class="text-lg font-medium mb-1">No {{ entityName.toLowerCase() }} found</p>
                  <p class="text-sm">{{ searchQuery ? 'Try adjusting your search terms.' : 'Get started by adding a new ' + entityName.toLowerCase() + '.' }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div *ngIf="paginatedData.length > 0" class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              (click)="goToPage(currentPage - 1)"
              [disabled]="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              (click)="goToPage(currentPage + 1)"
              [disabled]="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing {{ getStartRecord() }} to {{ getEndRecord() }} of {{ filteredData.length }} results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button 
                  (click)="goToPage(currentPage - 1)"
                  [disabled]="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </button>
                
                <button 
                  *ngFor="let page of getPageNumbers()"
                  (click)="goToPage(page)"
                  [class]="page === currentPage ? 
                    'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-400' : 
                    'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  {{ page }}
                </button>
                
                <button 
                  (click)="goToPage(currentPage + 1)"
                  [disabled]="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DataTableComponent {
  @Input() title = '';
  @Input() entityName = 'Item';
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() showAddButton = true;
  @Input() pageSize = 10;
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() addClick = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  searchQuery = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  
  filteredData: any[] = [];
  paginatedData: any[] = [];

  ngOnInit(): void {
    this.updateData();
  }

  ngOnChanges(): void {
    this.updateData();
  }

  private updateData(): void {
    this.filteredData = this.data;
    this.applySearch();
    this.applySort();
    this.applyPagination();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applySearch();
    this.applyPagination();
    this.search.emit(this.searchQuery);
  }

  private applySearch(): void {
    if (!this.searchQuery) {
      this.filteredData = [...this.data];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredData = this.data.filter(item => 
      this.columns.some(column => {
        const value = this.getValue(item, column.key);
        return value?.toString().toLowerCase().includes(query);
      })
    );
  }

  onSort(columnKey: string): void {
    if (this.sortColumn === columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }
    
    this.applySort();
    this.applyPagination();
  }

  private applySort(): void {
    if (!this.sortColumn) return;

    this.filteredData.sort((a, b) => {
      const aValue = this.getValue(a, this.sortColumn);
      const bValue = this.getValue(b, this.sortColumn);
      
      let result = 0;
      if (aValue < bValue) result = -1;
      else if (aValue > bValue) result = 1;
      
      return this.sortDirection === 'asc' ? result : -result;
    });
  }

  private applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyPagination();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getStartRecord(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredData.length);
  }

  getValue(item: any, key: string): any {
    return key.split('.').reduce((obj, prop) => obj?.[prop], item);
  }

  getBadgeClass(column: TableColumn, value: any): string {
    return column.badgeConfig?.[value]?.class || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }

  getBadgeLabel(column: TableColumn, value: any): string {
    return column.badgeConfig?.[value]?.label || value;
  }

  getVisibleActions(item: any): TableAction[] {
    return this.actions.filter(action => !action.visible || action.visible(item));
  }

  onRowClick(item: any): void {
    this.rowClick.emit(item);
  }

  onAdd(): void {
    this.addClick.emit();
  }
}
