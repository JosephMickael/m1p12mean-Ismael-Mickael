import { Component, OnInit } from '@angular/core';
import { RendezVous } from '../services/rendezvous.service';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-rendezvous',
  imports: [MatDatepickerModule,
      MatNativeDateModule,
      MatInputModule,
      MatFormFieldModule
    ],
  templateUrl: './rendezvous.component.html',
  styleUrl: './rendezvous.component.css'
})
export class RendezvousComponent implements OnInit {

  availableRendezvous: any[] = [];

    constructor( private route: Router, private rendezVous: RendezVous) {}

  ngOnInit(): void {
    this.listAvailableRendezvous(); 
  }

  // Lister tous les rendezVous 
  listAvailableRendezvous(): void {
   this.rendezVous.getAvailableRendezvous().subscribe(data => this.availableRendezvous = data) 
  }

  // Reservation de rendezvous
  reserveavailableRendezvous(rendezVousId: string, clientName: string): void {
    this.rendezVous.reserveRendezVous(rendezVousId, clientName).subscribe(() => {
      this.listAvailableRendezvous(); 
    })
  }

  //creation un rendezVous automatiquement 
  createAutoRendevous(date: Date, time: string): void  {
    this.rendezVous.createRendezVous(date, time).subscribe(() => 
      this.listAvailableRendezvous())
  }
 
  // assigner un mecanicien disponible à un rendezVous par le client ou le système
  assignAvailableMecanicien(rendezVous: string): void {
    this.rendezVous.assignAvailableMecanicien(rendezVous).subscribe(() => 
    this.listAvailableRendezvous())
  }

  // assigner à un mecanicien un rendezVous fait par le manager
  assignRendezVous(rendezVousId: string, mecanicienId: string): void {
    this.rendezVous.assignRendezVous(rendezVousId, mecanicienId).subscribe(() => 
    this.listAvailableRendezvous())
  }
  // Méthode pour convertir une chaîne de date en objet Date
  parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);  // Mois commence à 0 en JavaScript
  }
}
