import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private sidebarOpenSubject = new BehaviorSubject<boolean>(true);
  private darkModeSubject = new BehaviorSubject<boolean>(false);

  sidebarOpen$ = this.sidebarOpenSubject.asObservable();
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    this.setDarkMode(isDark);
  }

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  setSidebarOpen(open: boolean): void {
    this.sidebarOpenSubject.next(open);
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.darkModeSubject.value);
  }

  setDarkMode(enabled: boolean): void {
    this.darkModeSubject.next(enabled);
    
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
