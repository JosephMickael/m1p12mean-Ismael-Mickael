import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acceuil',
  imports: [CommonModule],
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.css'
})
export class AcceuilComponent {
  currentUser: any

  constructor(private userservice: UserService, private authservice: AuthService) { }

  ngOnInit() {
    this.currentUser = this.authservice.getCurrentUser()
  }
}
