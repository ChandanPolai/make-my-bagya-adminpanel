import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Theme } from '../interfaces/sidebar.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themes: Theme[] = [
  {
    name: 'blue',
    primary: 'tw-bg-admin-blue',    // Matches your tailwind config
    secondary: 'tw-bg-blue-50',     // Keep default blue-50 (or define admin-blue-50)
    accent: 'tw-text-admin-blue',   // Text color
    background: 'tw-bg-white'  ,     // Background
    primaryGradientFrom: 'tw-from-blue-400'
  },
  {
    name: 'green',
    primary: 'tw-bg-admin-green',
    secondary: 'tw-bg-green-50',
    accent: 'tw-text-admin-green',
    background: 'tw-bg-white',
    primaryGradientFrom: 'tw-from-green-400'
  },
  {
    name: 'purple',
    primary: 'tw-bg-admin-purple',
    secondary: 'tw-bg-purple-50',
    accent: 'tw-text-admin-purple',
    background: 'tw-bg-white',
    primaryGradientFrom: 'tw-from-purple-400'
  },
  {
    name: 'orange',
    primary: 'tw-bg-admin-orange',
    secondary: 'tw-bg-orange-50',
    accent: 'tw-text-admin-orange',
    background: 'tw-bg-white',
    primaryGradientFrom: 'tw-from-orange-400'
  },
  {
    name: 'red',
    primary: 'tw-bg-admin-red',
    secondary: 'tw-bg-red-50',
    accent: 'tw-text-admin-red',
    background: 'tw-bg-white',
    primaryGradientFrom: 'tw-from-red-400'
  },
  {
    name: 'yellow',
    primary: 'tw-bg-admin-yellow',
    secondary: 'tw-bg-yellow-50',
    accent: 'tw-text-admin-yellow',
    background: 'tw-bg-white',
    primaryGradientFrom: 'tw-from-yellow-400'
  }
];

  private currentThemeSubject = new BehaviorSubject<Theme>(this.themes[0]);
  public currentTheme$: Observable<Theme> = this.currentThemeSubject.asObservable();

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const theme = this.themes.find(t => t.name === savedTheme);
      if (theme) {
        this.currentThemeSubject.next(theme);
      }
    }
  }

  setTheme(theme: Theme): void {
    if (!theme) return;
    
    const selectedTheme = this.themes.find(t => t.name === theme.name);
    if (selectedTheme) {
      this.currentThemeSubject.next(selectedTheme);
      localStorage.setItem('theme', selectedTheme.name);
      
      // Apply theme classes to the root element
      this.applyThemeToRoot(selectedTheme);
    }
  }

  private applyThemeToRoot(theme: Theme): void {
    const root = document.documentElement;
    
    // Remove all existing theme classes
    this.themes.forEach(t => {
      root.classList.remove(t.primary, t.secondary, t.accent, t.background);
    });
    
    // Add new theme classes
    root.classList.add(
      theme.primary,
      theme.secondary,
      theme.accent,
      theme.background
    );
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  getThemes(): Theme[] {
    return this.themes;
  }
}
