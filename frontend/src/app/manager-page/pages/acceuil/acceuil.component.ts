import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RendezVous } from '../../../services/rendezvous.service';

@Component({
  selector: 'app-acceuil',
  imports: [CommonModule],
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.css'
})
export class AcceuilComponent {
  currentUser: any
  totalClients: any
  totalMecaniciens: any
  rdvEnAttente: number = 0
  rdvAnnule: number = 0
  lastClients: any[] = []
  lastMecaniciens: any[] = []

  constructor(private userservice: UserService, private authservice: AuthService, private rdvservice: RendezVous) { }

  ngOnInit() {
    this.currentUser = this.authservice.getCurrentUser()
    this.getUsersDetails()
    this.getRdvDetails()
  }

  getUsersDetails() {
    this.userservice.getUsersDetails().subscribe({
      next: (response: any) => {
        this.totalClients = response.totalClients
        this.totalMecaniciens = response.totalMecaniciens

        this.lastClients = response.lastClients
        this.lastMecaniciens = response.lastMecaniciens

      }, error: (error) => {
        console.error('Erreur:', error);
      }
    })
  }

  getRdvDetails() {
    this.rdvservice.getRdvDetails().subscribe({
      next: (response: any) => {
        this.rdvEnAttente = response.rdvEnAttente
        this.rdvAnnule = response.rdvAnnule
      }, error: (error) => {
        console.error('Erreur:', error);
      }
    })
  }

  // format => 14 Mars 2025
  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    const formattedDate = new Date(date).toLocaleDateString('fr-FR', options);

    const parts = formattedDate.split(' ');

    if (parts.length >= 2) {
      parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    }

    return parts.join(' ');
  }

}
