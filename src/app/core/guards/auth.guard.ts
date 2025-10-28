import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStorage } from '../utilities/app-storage';
import { common } from '../constants/common';

export const authGuard: CanActivateFn = (route, state) => {
  const storage = inject(AppStorage);
  const router = inject(Router);

  const userData = storage.get(common.USERDATA);
  const accessToken = storage.get(common.TOKEN);

  if (userData && accessToken ) {
    // If authenticated and root path, redirect to dashboard
    if (state.url === '/' || state.url === '') {
      return router.createUrlTree(['/dashboard']);
    }
    return true; // Allow access to other protected routes
  } else {
    return router.createUrlTree(['/sign-in']);
  }
};