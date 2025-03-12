import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent {
  utilisateurs: any

  constructor(private userservice: UserService) { }

  ngOnInit() {
    this.getAllUsers()
  }

  getAllUsers() {
    this.userservice.getAllUsers().subscribe(
      (response: any) => {
        console.log(response);
        this.utilisateurs = response;
      },
      error => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      })
  }
}
