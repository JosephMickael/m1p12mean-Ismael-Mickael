import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authservice: AuthService,
        private router: Router
    ) { }

    canActivate(): boolean {
        if (this.authservice.isLoggedIn()) {
            const userRole = this.authservice.getUserRole();
            // Rediriger l'utilisateur vers sa page en fonction de son rôle
            if (userRole.includes('client')) {
                this.router.navigate(['/client-page']);
            } else if (userRole.includes('mecanicien')) {
                this.router.navigate(['/mecanicien-page']);
            } else if (userRole.includes('manager')) {
                this.router.navigate(['/manager-page'])
            }
            return false;
        }
        return true;
    }
}