import { Component, OnInit } from '@angular/core';
import { RendezVous } from '../../../services/rendezvous.service';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { RendezVousModel } from '../../../models/rendezvous.model'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rendezvous-manager',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
  rendezVousForm: FormGroup;
  rendezVousId: string
  rendezVous: any;
  mecaniciens: any[] = []
  submitted: boolean = false
  errorMessage: string = ''
  successMessage: string = ''
  deleteMessage: string = ''
  selectedRdv: any = null;
  status: any = {}

  statusOptions = [
    "en attente", "confirmé", "assigné", "annulé", "disponible", "réservé", "terminé"
  ];


  constructor(private rdvservice: RendezVous, private userservice: UserService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,) {
    this.rendezVousForm = this.formBuilder.group({
      heure: ['', Validators.required],
      date: ['', Validators.required],
      status: ['', Validators.required],
      services: [''],
      mecanicien: ['', Validators.required]
    });

    // récuperation de l'id dans la route (service)
    this.rendezVousId = this.route.snapshot.params['id'];

    // this.loadRendezVous();
    this.loadMecaniciens();
  }

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
          this.todayRdv = this.data.slice(0, 3); // n'afficher que 3
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
        this.status = response
      }
    })
  }

  // utile pour update (liste mecaniciens)
  loadMecaniciens(): void {
    this.userservice.getAllUsers()
      .subscribe({
        next: (response: any) => {
          response.forEach((user: { role: string | string[]; }) => {
            if (Array.isArray(user.role) && user.role.includes('mecanicien')) {
              this.mecaniciens.push(user)
            }
          });
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement des mécaniciens: ' + error.message;
        }
      });
  }

  // pre remplissage du formulaire (update)
  prepareFormForEdit(rendezvous: any): void {
    this.selectedRdv = rendezvous;
    this.errorMessage = ''

    const dateObj = new Date(rendezvous.date);
    const formattedDate = dateObj.toISOString().split('T')[0];

    this.rendezVousForm.patchValue({
      heure: rendezvous.heure,
      date: formattedDate,
      status: rendezvous.status,
      services: rendezvous.services,
      mecanicien: Array.isArray(rendezvous.mecanicien) ?
        (rendezvous.mecanicien[0]?._id || rendezvous.mecanicien[0]) :
        (rendezvous.mecanicien?._id || rendezvous.mecanicien)
    });
  }

  updateRendezVous(): void {
    this.submitted = true;

    if (this.rendezVousForm.invalid) {
      return;
    }

    const updatedData = this.rendezVousForm.value;

    // Convertion en tableau (backend)
    updatedData.mecanicien = [updatedData.mecanicien];

    this.rdvservice.updateRendezVous(this.selectedRdv._id, updatedData)
      .subscribe({
        next: (response) => {
          this.successMessage = 'Mis à jour avec succès'
          setTimeout(() => this.successMessage = '', 2000)
          this.getListeRendezvous()
          this.getRdvDetails()
          this.getTodayRdv()
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la mise à jour: ' + error.message;
          setTimeout(() => this.errorMessage = '', 2000)
        }
      });
  }

  deleteRendezVous(rendezVousId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous?')) {
      this.rdvservice.deleteRendezVous(rendezVousId).subscribe({
        next: (response: any) => {
          this.deleteMessage = 'Rendez-vous supprimé avec succès';
          this.getListeRendezvous()
          this.getRdvDetails()
          this.getTodayRdv()
          setTimeout(() => this.deleteMessage = '', 3000);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.errorMessage = err.error?.message || 'Erreur lors de la suppression de l\'utilisateur';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
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
