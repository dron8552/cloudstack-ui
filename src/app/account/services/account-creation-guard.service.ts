import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountCreationGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  public canActivate(): boolean {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
    }
    return this.authService.isAdmin();
  }
}
