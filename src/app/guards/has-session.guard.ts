import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {SessionService} from '@store/session.service';
import {of} from 'rxjs';
import {first, map} from 'rxjs/operators';

export const hasSessionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);

  if (sessionService.isSessionLoading) {
    return of(false); // ou mostrar um loading
  }

  return sessionService.getUser().pipe(
    first(),
    map(user => {
      if (!sessionService.isAuthenticated()) {
        router.navigate(['/login']).then();
        return false;
      }
      return true;
    })
  );
};
