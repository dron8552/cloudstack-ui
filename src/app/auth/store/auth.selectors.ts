import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll as getAccounts } from '../../reducers/accounts/redux/accounts.reducers';
import { AuthState, authStoreName } from './auth.reducers';
import { AccountUser, Account } from '../../shared/models';

const getAuthState = createFeatureSelector<AuthState>(authStoreName);

export const getAccountName = createSelector(
  getAuthState,
  state => state.accountName,
);

export const getUserId = createSelector(
  getAuthState,
  state => state.userId,
);

export const getDomainId = createSelector(
  getAuthState,
  state => state.domainId,
);

export const getSessionKey = createSelector(
  getAuthState,
  state => state.sessionKey,
);

export const getIsLoggedIn = createSelector(
  getUserId,
  id => !!id,
);

export const getAccount = createSelector(
  getAccountName,
  getAccounts,
  (accountName, accounts): Account | undefined => accounts.find(acc => acc.name === accountName),
);

export const getUser = createSelector(
  getUserId,
  getAccount,
  (userId, account): AccountUser | undefined => {
    return account && account.user.find(user => user.id === userId);
  },
);
