import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RendezVous } from '../services/rendezvous.service';
import { Router } from '@angular/router';
import { MatCalendar, MatDatepicker, MatDatepickerModule, MatDateSelectionModel } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatListItem, MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-rendezvous',
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatCardModule,
    MatListItem,
    MatDatepicker,
    MatNativeDateModule,
    MatTableModule,
    MatDatepickerModule,
    MatDatepicker,
    MatIconButton,
    MatListModule,
    MatIconModule,
    NgxMatTimepickerModule,
    MatCalendar,
    ReactiveFormsModule
  ],
  templateUrl: './rendezvous.component.html',
  styleUrl: './rendezvous.component.css',
  providers: [DatePipe]
})
export class RendezvousComponent implements OnInit {

  listRendezVous: string = ""; 
  availableRendezvous: any[] = [];
  mecaniciens: any[] = []; 
  userRole: any = [];
  selectedMecanicien: string = "";  
  selectedRendezVous: string = ""; 
  assignedRendezvous: any[] = []; 
  selectedTime: string = ""; 
  selectedDate: Date = new Date();
  errorMessage: string = ""; 
  userClientId: string = ""; 
  success: string = "";
  errorMessageDate: string = ""; 
  successReservation: string = ""; 
  statusRendezVous: any[] = []; 
  selectedService: string = ""; 
  autresServices: string = ""; 



    constructor( private route: Router, private rendezVous: RendezVous, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getUserRoleFromToken();
    this.listAvailableRendezvous(); 
    this.listMecaniciens();
    this.getStatusRendezVous();
    if (this.userRole == 'mecanicien') {
      this.listAssignedRendezvous();
    } 
  }  

  // Formatage date 
    formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd MMMM yyyy') || '';
  }

  // Liste de rendezVous du client et du mecanicien 
  getRendezVous(): void {
    this.rendezVous.listRendezVous().subscribe((data) => {
      this.listRendezVous = data; 
    })
  }

  // Comtage des status rendezVous 
  getStatusRendezVous(): void {
    this.rendezVous.getStatusRendezVous().subscribe(data => {
      this.statusRendezVous = data
    })
  }


  // Récupérer le rôle de l'utilisateur depuis le token JWT
  getUserRoleFromToken(): void {
    const token = localStorage.getItem('token'); 
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); 
        this.userRole = decodedToken.role; 
        console.log("Rôle de l'utilisateur:", this.userRole);
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
      }
    } else {
      console.warn("Aucun token trouvé !");
    }
  }

    // Récupérer la liste des mécaniciens
    listMecaniciens(): void {
      this.rendezVous.recupererMecanicien().subscribe(data => {   
        this.mecaniciens = data;
      });
    }

  // Lister tous les rendezVous 
  listAvailableRendezvous(): void {
   this.rendezVous.getAvailableRendezvous().subscribe(data => this.availableRendezvous = data) 
  }

  // Reservation de rendezvous
  reserveavailableRendezvous(rendezVousId: string): void {
    this.successReservation = "";
    this.errorMessage = ""; 
    this.rendezVous.reserveRendezVous(rendezVousId).subscribe({
      next: () => { 
        this.successReservation = "réservation effectué avec succès"; 
        this.listAvailableRendezvous(); 
      },
      error: (error) => {
        this.errorMessage =  "Rendezvous non disponible";
      }
    })
  }


  createAutoRendezVous(date: Date, time: string, services: string): void {
    this.errorMessage = "";
    this.success=""; 

    if (!date || !time || !services) {
      this.errorMessageDate = "Veuillez sélectionner une date et une heure et votre service demandé svp";
      return;
    }

    this.rendezVous.createRendezVous(date, time, services).subscribe({
      next: () => {
        this.listAvailableRendezvous();
        this.success = "Création de rendezVous effectué avec succès !"; 
      },
      error: (error) => {
        console.error("Erreur backend:", error);
        this.errorMessage = error.error?.message || "Erreur";
      }
    });
  }


 
  // assigner un mecanicien disponible à un rendezVous par le client ou le système
  assignAvailableMecanicien(rendezVous: string): void {
    this.rendezVous.assignAvailableMecanicien(rendezVous).subscribe(() => 
    this.listAvailableRendezvous())
  }

  // assigner à un mecanicien un rendezVous fait par le manager
  assignRendezVous(rendezVousId: string, mecanicienId: string): void {
    this.rendezVous.assignRendezVous(rendezVousId, mecanicienId).subscribe({
      next : () => {
        alert("Rendez-vous assigné avec succès !");
        this.listAvailableRendezvous();
      },
      error: (error) => {
        console.error("Erreur API :", error); 
        alert("Erreur : " + (error.error?.message || "Problème inconnu"));
      }
    });
}

  // Listé les rendezVous assignés
  listAssignedRendezvous(): void {
    this.rendezVous.getAssignedRendezvous().subscribe(data => {
      this.assignedRendezvous = data;
    });
  }
  
  // Méthode pour convertir une chaîne de date en objet Date
  parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);  // Mois commence à 0 en JavaScript
  }

  //annulerRendezVous 
  annulerRendezVous(rendezVousId: string): void {
    this.rendezVous.annulerRendezVous(rendezVousId).subscribe(() => 
      this.listAvailableRendezvous());
  }
}
