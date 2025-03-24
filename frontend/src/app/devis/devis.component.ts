import { Component, OnInit } from '@angular/core';
import { DevisService } from '../services/devis.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-devis',
  imports : [
    CommonModule,
    FormsModule
  ],
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.css']
})
export class DevisComponent implements OnInit {

  devis: any[] = [];
  newDevis = {
    client: '',
    mecanicien: '',
    manager: '',
    services: [],
    pieces: []
  };
  selectedDevis: any = null;
  listUser : any[] = [];


  constructor(private devisService: DevisService) { }

  ngOnInit(): void {
    this.getAllDevis();
  }

  // Recuperer les utilisateur selon le devis correspondant
  getAllUser(): void {
    this.devisService.getAllUser().subscribe(
      (data: any) => {
        this.listUser = data;
      },
      (error) => {
        console.error('Erreur lors de la recup user', error);
      }
    )
  }

  // Récupérer tous les devis
  getAllDevis(): void {
    this.devisService.getAllDevis().subscribe(
      (data: any) => {
        this.devis = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des devis', error);
      }
    );
  }

  // Créer un devis
  creerDevis(): void {
    this.devisService.creerDevis(this.newDevis).subscribe(
      (response: any) => {
        console.log('Devis créé avec succès', response);
        this.getAllDevis();  // Rafraîchir la liste des devis
      },
      (error) => {
        console.error('Erreur lors de la création du devis', error);
      }
    );
  }

  // Modifier un devis
  modifierDevis(id: string): void {
    this.devisService.modifierDevis(id, this.selectedDevis).subscribe(
      (response: any) => {
        console.log('Devis mis à jour avec succès', response);
        this.getAllDevis();  // Rafraîchir la liste des devis
      },
      (error) => {
        console.error('Erreur lors de la modification du devis', error);
      }
    );
  }

  // Supprimer un devis
  supprimerDevis(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      this.devisService.supprimerDevis(id).subscribe(
        (response) => {
          console.log('Devis supprimé avec succès');
          this.getAllDevis();  // Rafraîchir la liste des devis
        },
        (error) => {
          console.error('Erreur lors de la suppression du devis', error);
        }
      );
    }
  }

  // Valider un devis
  validerDevis(id: string): void {
    this.devisService.validerDevis(id).subscribe(
      (response) => {
        console.log('Devis validé avec succès', response);
        this.getAllDevis();  // Rafraîchir la liste des devis
      },
      (error) => {
        console.error('Erreur lors de la validation du devis', error);
      }
    );
  }

  // Sélectionner un devis pour la modification
  selectDevis(devis: any): void {
    this.selectedDevis = { ...devis };
  }

}
