import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(
        private loginService: LoginService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data['role']
        const userRole = this.loginService.getUserRole()

        if (!this.loginService.isLoggedIn() || !userRole.includes(expectedRole)) {
            this.router.navigate(['/login'])
            return false
        }

        return true
    }
}
