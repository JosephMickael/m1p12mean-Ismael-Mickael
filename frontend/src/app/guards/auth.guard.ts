import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private loginService: LoginService,
        private router: Router
    ) { }

    canActivate(): boolean {
        if (this.loginService.isLoggedIn()) {
            const userRole = this.loginService.getUserRole();
            // Rediriger l'utilisateur vers sa page en fonction de son rôle
            if (userRole.includes('client')) {
                this.router.navigate(['/client-page']);
            } else if (userRole.includes('mecanicien')) {
                this.router.navigate(['/mecanicien-page']);
            }
            return false;
        }
        return true;
    }
}