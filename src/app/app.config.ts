import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideDaterangepickerLocale } from 'ngx-daterangepicker-bootstrap';

import { routes } from './app.routes';
import { headerInterceptor } from './core/interceptors/http-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([headerInterceptor])),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideDaterangepickerLocale({
      separator: ' to ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      clearLabel: 'Clear',
      format: 'DD/MM/YYYY',
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      firstDay: 1
    }),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
};