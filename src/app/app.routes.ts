import { Routes } from '@angular/router';
import { MainLayoutComponent } from './views/partial/main-layout/main-layout.component';
import { DashboardComponent } from './views/features/dashboard/dashboard.component';
import { ChangePasswordComponent } from './views/partial/change-password/change-password.component';
import { UserProfileComponent } from './views/features/user-profile/user-profile.component';

// money switch code project routes

import { UsersComponent } from './views/features/users/users.component';
import { ServicesComponent } from './views/features/services/services.component';
import { TranscationComponent } from './views/features/transcation/transcation.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./views/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'settings',
        children: [
          { path: 'change-password', component: ChangePasswordComponent },
          { path: 'user-profile', component: UserProfileComponent },
        ],
      },

      // money switch code project routes
      { path: 'users', component: UsersComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'transcation', component: TranscationComponent },
    ],
  },

  { path: '**', redirectTo: 'sign-in' },
];
