import { CanActivateFn, Router } from '@angular/router';
import { AppStorage } from '../utilities/app-storage';
import { inject } from '@angular/core';
import { common } from '../constants/common';

export const loginGuard: CanActivateFn = (route, state) => {
   const storage = inject(AppStorage);
   const accessTokem=storage.get(common.TOKEN)
  const userData = storage.get(common.USERDATA);
  
  if (userData && accessTokem) {
    const router = inject(Router);
    return router.createUrlTree(['/dashboard']); 
  } else {
    return true; 
  }
};
