import { Component, Input } from '@angular/core';
import { Theme } from '../../../core/interfaces/sidebar.interface';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() isCollapsed = false;
  @Input() currentTheme: Theme = {
    name: 'blue',
    primary: 'bg-blue-600',
    secondary: 'bg-blue-50',
    accent: 'text-blue-600',
    background: 'bg-white'
  };

  currentYear = new Date().getFullYear();
  
  quickStats = [
    { label: 'Active JDs', value: 12, icon: 'ph-briefcase' },
    { label: 'Candidates', value: 248, icon: 'ph-users' },
    { label: 'Interviews Today', value: 5, icon: 'ph-video-camera' },
    { label: 'Pending Reviews', value: 18, icon: 'ph-clock' }
  ];

  systemInfo = {
    version: '2.1.4',
    lastUpdate: 'Updated 2 days ago',
    status: 'All systems operational'
  };
} 
