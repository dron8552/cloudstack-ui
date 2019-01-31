import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { AuthActionTypes, Login, LoginFailure, LoginSuccess, LogoutComplete } from './auth.actions';
import { RouterUtilsService } from '../../shared/services/router-utils.service';
import {
  configSelectors,
  IdleMonitorActions,
  routerSelectors,
  State,
  UserTagsActions,
} from '../../root-store/';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false })
  logout$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.IdleLogout, AuthActionTypes.Logout),
    tap(() =>
      this.router.navigate(['/logout'], this.routerUtilsService.getRedirectionQueryParams()),
    ),
  );

  @Effect()
  logoutSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<LogoutComplete>(AuthActionTypes.LogoutComplete),
    withLatestFrom(this.store.pipe(select(configSelectors.getDefaultUserTags))),
    mergeMap(([action, tags]) => [
      new IdleMonitorActions.StopIdleMonitor(),
      new UserTagsActions.SetDefaultUserTagsDueToLogout({ tags }),
    ]),
  );

  @Effect()
  login$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.Login),
    map(action => action.payload),
    exhaustMap(credentials => {
      return this.authService.login2(credentials).pipe(
        map(user => new LoginSuccess({ user })),
        catchError(error => of(new LoginFailure({ error }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$.pipe(
    ofType<LoginSuccess>(AuthActionTypes.LoginSuccess),
    withLatestFrom(this.store.pipe(select(routerSelectors.getQueryParams))),
    tap(([action, queryParams]) => {
      const url =
        queryParams['next'] && queryParams['next'] !== '/login' && queryParams['next'] !== 'login'
          ? queryParams['next']
          : '';
      this.router.navigateByUrl(url);
    }),
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private routerUtilsService: RouterUtilsService,
    private store: Store<State>,
    private authService: AuthService,
  ) {}
}
