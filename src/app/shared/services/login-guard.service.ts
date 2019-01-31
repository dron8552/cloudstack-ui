import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../auth/auth.service';
import { select, Store } from '@ngrx/store';
import { State } from '../../root-store';
import { authSelectors } from '../../auth/store';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private store: Store<State>) {}

  public canActivate(): Observable<boolean> {
    // return this.auth.isLoggedIn().pipe(
    // todo maybe need to delete
    return this.store.pipe(
      select(authSelectors.getIsLoggedIn),
      map(result => {
        if (result) {
          this.router.navigate(['/instances']);
        }
        return !result;
      }),
    );
  }
}
