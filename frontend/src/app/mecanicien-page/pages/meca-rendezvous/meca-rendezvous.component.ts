import { Component, OnInit } from '@angular/core';
import { RendezVous } from '../../../services/rendezvous.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-meca-rendezvous',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './meca-rendezvous.component.html',
  styleUrl: './meca-rendezvous.component.css'
})
export class MecaRendezvousComponent implements OnInit {
  listeRendezVous: any[] = []
  statusForm: FormGroup
  selectedRdv: any = null;
  errorMessage: string = ''
  successMessage: string = ''
  submitted: boolean = false

  statusOptions = [
    "en attente", "confirmé", "assigné", "annulé", "disponible", "réservé", "terminé"
  ];


  constructor(private rdvservice: RendezVous, private formBuilder: FormBuilder) {
    this.statusForm = this.formBuilder.group({
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllRendezVous()
  }

  getAllRendezVous() {
    this.rdvservice.getAllMecaRendezVous().subscribe({
      next: (response: any) => {
        this.listeRendezVous = response.data
      }, error: error => {
        console.error('Erreur lors de la récupération des rendez-vous', error.message);
      }
    })
  }

  prepareFormForEdit(rendezvous: any): void {
    this.selectedRdv = rendezvous;
    this.errorMessage = ''

    this.statusForm.patchValue({
      status: rendezvous.status,
    });
  }

  updateRendezVousStatus() {
    this.submitted = true

    if (this.statusForm.invalid) {
      return
    }

    const statusData = this.statusForm.value

    this.rdvservice.updateRendezVous(this.selectedRdv._id, statusData).subscribe({
      next: (response) => {
        this.successMessage = "Status modifié avec succès"
        setTimeout(() => this.successMessage = '', 2000)
        this.getAllRendezVous()
      }, error: error => {
        console.error('Erreur lors de la récupération des rendez-vous', error.message)
        setTimeout(() => this.errorMessage = '', 2000)
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
