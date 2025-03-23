import { Component, OnInit } from '@angular/core';
import { RendezVous } from '../../../services/rendezvous.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meca-rendezvous',
  imports: [CommonModule],
  templateUrl: './meca-rendezvous.component.html',
  styleUrl: './meca-rendezvous.component.css'
})
export class MecaRendezvousComponent implements OnInit {
  listeRendezVous: any[] = []

  constructor(private rdvservice: RendezVous) { }

  ngOnInit(): void {
    this.getAllRendezVous()
  }

  getAllRendezVous() {
    this.rdvservice.getAllMecaRendezVous().subscribe({
      next: (response: any) => {
        this.listeRendezVous = response
      }, error: error => {
        console.error('Erreur lors de la récupération des rendez-vous', error.message);
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
