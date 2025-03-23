import { Component, OnInit } from '@angular/core';
import { RendezVous } from '../../../services/rendezvous.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acceuil-client',
  imports: [CommonModule],
  templateUrl: './acceuil-client.component.html',
  styleUrl: './acceuil-client.component.css'
})
export class AcceuilClientComponent implements OnInit {

  listRendezVous: any[] = []
  status: any = {}

  constructor(private rdvservice: RendezVous) { }

  ngOnInit(): void {
    this.getRendezVous()
    this.getRendezVousDetails()
  }

  getRendezVous(): void {
    this.rdvservice.listRendezVous().subscribe(
      (response) => {
        if (response.appointments) {
          this.listRendezVous = response.appointments;
        } else {
          this.listRendezVous = response;
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des rendez-vous', error);
      }
    );
  }

  getRendezVousDetails() {
    this.rdvservice.getRdvDetails().subscribe({
      next: (response: any) => {
        this.status = response
      }, error: error => {
        console.error('Erreur lors de la récupération des rendez-vous', error);
      }
    })
  }

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
