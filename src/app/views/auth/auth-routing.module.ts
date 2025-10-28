import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { loginGuard } from '../../core/guards/login.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sign-in' }, // Redirect root to sign-in without guard
  { path: 'sign-in', component: SignInComponent, canActivate: [loginGuard] }, // Apply guard to sign-in
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }