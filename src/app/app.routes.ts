import { Routes } from '@angular/router';
import { MainLayoutComponent } from './views/partial/main-layout/main-layout.component';
import { DashboardComponent } from './views/features/dashboard/dashboard.component';
import { ChangePasswordComponent } from './views/partial/change-password/change-password.component';
import { UserProfileComponent } from './views/features/user-profile/user-profile.component';

// ndvive project routes
import { DashboardsComponent } from './views/features/dasboards/dasboards.component';
import { RegisterComponent } from './views/features/register/register.component';
import { UsersComponent } from './views/features/users/users.component';
import { CategoryComponent } from './views/features/category/category.component';
import { SubcategoryComponent } from './views/features/subcategory/subcategory.component';
import { VideosComponent } from './views/features/videos/videos.component';
import { ServicesComponent } from './views/features/services/services.component';
import { TranscationComponent } from './views/features/transcation/transcation.component';
import { DeleteAcountComponent } from './views/features/delete-acount/delete-acount.component';

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

      // ndvive project routes
      // { path: 'register', component: RegisterComponent },
      { path: 'users', component: UsersComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'subcategory', component: SubcategoryComponent },
      { path: 'videos', component: VideosComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'transcation', component: TranscationComponent },
      { path: 'delete-acount', component: DeleteAcountComponent },
    ],
  },

  { path: '**', redirectTo: 'sign-in' },
];
