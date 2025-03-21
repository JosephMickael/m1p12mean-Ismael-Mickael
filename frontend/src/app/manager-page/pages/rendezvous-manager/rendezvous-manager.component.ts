import { Component, OnInit } from '@angular/core';
import { RendezVous } from '../../../services/rendezvous.service';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { RendezVousModel } from '../../../models/rendezvous.model'

@Component({
  selector: 'app-rendezvous-manager',
  imports: [CommonModule],
  templateUrl: './rendezvous-manager.component.html',
  styleUrl: './rendezvous-manager.component.css'
})
export class RendezvousManagerComponent implements OnInit {
  listeRendezVous: RendezVousModel[] = []
  todayRdv: any[] = []
  todayMessage: string = ''
  data: any[] = []
  client: any
  totalRdv: string = ''
  rdvConfirme: string = ''
  rdvEnAttente: string = ''
  rdvAnnule: string = ''


  constructor(private rdvservice: RendezVous, private userservice: UserService) { }

  ngOnInit() {
    this.getListeRendezvous()
    this.getRdvDetails()
    this.getTodayRdv()
  }

  getListeRendezvous() {
    this.rdvservice.getAllRendezVous().subscribe({
      next: (response) => {
        this.listeRendezVous = response;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rendez-vous', error);
      }
    });
  }

  getTodayRdv(): void {
    this.rdvservice.getTodayRdv().subscribe({
      next: (response: any) => {

        this.data = response.data

        if (this.data.length > 0) {
          for (let i = 0; i < 3; i++) {
            this.todayRdv.push(this.data[i])
          }
        } else {
          this.todayMessage = "Aucun rendez-vous pour aujourd'hui"
        }

      }, error: (error) => {
        console.error('Erreur lors du chargement des rendez-vous', error);
      }
    })
  }

  getRdvDetails() {
    this.rdvservice.getRdvDetails().subscribe({
      next: (response: any) => {
        this.totalRdv = response.totalRdv
        this.rdvConfirme = response.rdvConfirmé
        this.rdvEnAttente = response.rdvEnAttente
        this.rdvAnnule = response.rdvAnnule
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
