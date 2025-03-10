import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(
        private authservice: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data['role']
        const userRole = this.authservice.getUserRole()

        if (!this.authservice.isLoggedIn() || !userRole.includes(expectedRole)) {
            this.router.navigate(['/login'])
            return false
        }

        return true
    }
}
