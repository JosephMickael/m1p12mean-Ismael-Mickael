import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-mecanicien-page',
  imports: [],
  templateUrl: './mecanicien-page.component.html',
  styleUrl: './mecanicien-page.component.css'
})
export class MecanicienPageComponent {
  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
