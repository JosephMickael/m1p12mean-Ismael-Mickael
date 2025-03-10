import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-manager-page',
  imports: [],
  templateUrl: './manager-page.component.html',
  styleUrl: './manager-page.component.css'
})
export class ManagerPageComponent {

  user: any;

  constructor(
    private router: Router,
    private authservice: AuthService,
    private userservice: UserService
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

  logout() {
    this.authservice.logout();
    this.router.navigate(['/login']);
  }

}
