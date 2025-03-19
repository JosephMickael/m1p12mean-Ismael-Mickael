import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-page',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './client-page.component.html',
  styleUrl: './client-page.component.css'
})
export class ClientPageComponent {
  constructor(private router: Router, private authservice: AuthService) { }

  logout() {
    this.authservice.logout();
    this.router.navigate(['/login']);
  }
}
