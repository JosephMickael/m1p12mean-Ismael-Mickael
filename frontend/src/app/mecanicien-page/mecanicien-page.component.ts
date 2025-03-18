import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mecanicien-page',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './mecanicien-page.component.html',
  styleUrl: './mecanicien-page.component.css'
})
export class MecanicienPageComponent {

  private user: string[] = []

  constructor(
    private router: Router,
    private authservice: AuthService,
    private userservice: UserService
  ) { }

  // ngOnInit() {
  //   this.userservice.getCurrentUser().subscribe({
  //     next: response => {
  //       console.log('Ici response current user', response)
  //       // this.user = response
  //     }
  //   })
  // }

  logout() {
    this.authservice.logout();
    this.router.navigate(['/login']);
  }
}
