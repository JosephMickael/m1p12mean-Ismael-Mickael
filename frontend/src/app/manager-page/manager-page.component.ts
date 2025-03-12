import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manager-page',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './manager-page.component.html',
  styleUrl: './manager-page.component.css'
})
export class ManagerPageComponent {

  user: any;
  isSidebarCollapsed: boolean = false;

  constructor(
    private router: Router,
    private authservice: AuthService,
  ) { }

  ngOnInit(): void {
    const decodedToken = this.authservice.getDecodedToken();

    if (decodedToken) {
      this.user = {
        userId: decodedToken.userId,
        email: decodedToken.email,
        nom: decodedToken.nom,
        role: decodedToken.role,
      };
    } else {
      console.log('Token invalide ou expiré');
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authservice.logout();
    this.router.navigate(['/login']);
  }

}
