import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-client-page',
  imports: [],
  templateUrl: './client-page.component.html',
  styleUrl: './client-page.component.css'
})
export class ClientPageComponent {
  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
