import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../auth/auth.service';
import { RouterUtilsService } from './router-utils.service';
import { authSelectors } from '../../auth/store';
import { select, Store } from '@ngrx/store';
import { State } from '../../root-store';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private routerUtilsService: RouterUtilsService,
    private store: Store<State>,
  ) {}

  public canActivate(_, state: RouterStateSnapshot): Observable<boolean> {
    // return this.auth.isLoggedIn().pipe(
    return this.store.pipe(
      select(authSelectors.getIsLoggedIn),
      map(result => {
        if (!result) {
          this.router.navigate(
            ['/logout'],
            this.routerUtilsService.getRedirectionQueryParams(state.url),
          );
        }
        return result;
      }),
    );
  }
}
