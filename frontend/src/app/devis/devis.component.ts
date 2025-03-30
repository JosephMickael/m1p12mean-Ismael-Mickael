import { Component, OnInit } from '@angular/core';
import { DevisService } from '../services/devis.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { PiecesComponent } from '../piece/piece.component';
import { Piece } from '../models/piece.model';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-devis',
  imports : [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PiecesComponent
  ],
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.css']
})
export class DevisComponent implements OnInit {

  devis: any[] = [];
  newDevis = {
    client: '',
    services: [
      {
        description: '',
        coutServices: 0
      }
    ],
    pieces: [] as Piece[], // definir dans un Objet anonyme
    totalGeneral: 0
  };
  selectedDevis: any = {};
  listUser: { _id: string, nom: string }[] = [];
  userRole: string = "";
  clientControl = new FormControl();
  filteredUsers$: Observable<{ _id: string, nom: string }[]> = new Observable();
  selectedUser: any = null;
  showDropdown: boolean = false;
  success: string  = "";
  errorMp: string = ""; 



  constructor(private devisService: DevisService) { }


  ngOnInit(): void {
    this.getAllDevis();
    this.getUserRoleFromToken();

    // alaina element an le tableau (client, manager,meca) ao am le objet de atao tableau ray [] mahazatra
    // zan hoe mba ipasena le clé client:  an objet fatong de element tableau [{obj1},{objt2}] no azo 
    this.devisService.getAllUserDevis().subscribe(data => {
      this.listUser = [...(data.client || [])]; 
    });

    ///console.log("Contient listUzser", this.listUser);

    // Activer le filtrage de l'autocomplétion
    this.filteredUsers$ = this.clientControl.valueChanges.pipe(
      //startWith(''),
      map(value => {
        if (this.selectedUser && value !== this.selectedUser.nom) {
          this.selectedUser = null;
          console.log("Veuillez choisir");
        }
        this.showDropdown = !!value;
        return this._filter(value || '');
      })
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.listUser.filter(user => user.nom.toLowerCase().includes(filterValue));
  }

  // this.listUser zan eto tableau efa vofiltrer donc mbola manana prop clé rehetra (_id, nom, ...)
  selectUser(user: any): void {
    this.selectedUser = user;
    this.clientControl.setValue(user.nom);
    this.newDevis.client = user._id;
    this.showDropdown = false;

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


  // Récupérer tous les devis
  getAllDevis(): void {
    this.devisService.getAllDevis().subscribe(
      (data: any) => {
        this.devis = data;
        this.selectedDevis="";
      },
      (error) => {
        console.error('Erreur lors de la récupération des devis', error);
      }
    );
  }

  // Créer un devis
  creerDevis(): void {
    this.success = "";
    this.errorMp = "";
    this.devisService.creerDevis(this.newDevis).subscribe({
      next: () => {
        this.success = "Devis créé avec succès"
        this.getAllDevis();
        setTimeout(()=> {
          this.success= "";
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors de la création du devis', err);
        this.errorMp = "Erreur lors de la création du devis veuillez bien vérifier"
      }
    }
    );
  }

  // Modifier un devis
  modifierDevis(id: string): void {
    this.devisService.modifierDevis(id, this.selectedDevis).subscribe(
      (response: any) => {
        console.log('Devis mis à jour avec succès', response);
        this.getAllDevis();
      },
      (error) => {
        console.error('Erreur lors de la modification du devis', error);
      }
    );
  }

  // Supprimer un devis
  supprimerDevis(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.devisService.supprimerDevis(id).subscribe(
          () => {
            Swal.fire('Supprimé !', 'Le devis a été supprimé avec succès.', 'success');
            this.getAllDevis();
          },
          (error) => {
            Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
            console.error('Erreur lors de la suppression du devis', error);
          }
        );
      }
    });
  }

  // Valider un devis
  validerDevis(id: string): void {
    this.devisService.validerDevis(id).subscribe(
      (response) => {
        console.log('Devis validé avec succès', response);
        this.getAllDevis();
      },
      (error) => {
        console.error('Erreur lors de la validation du devis', error);
      }
    );
  }

  // Sélectionner un devis pour la modification
  selectDevis(devis: any): void {
    this.selectedDevis = { ...devis };
    console.log("valeur de selectedDevis", this.selectedDevis);
  }

  // Supprimer une pièce du devis
  removePiece(index: number): void {
    this.newDevis.pieces.splice(index, 1);
  }

  // Enregistrer le devis
  saveDevis(): void {
    console.log('Devis enregistré:', this.newDevis);
  }

   // Ajouter une pièce au devis lorsque l'événement (Eventemitter() le natsoina tan am piece.component)
   onPieceAdded(piece: Piece): void {
    this.newDevis.pieces.push(piece);
    this.calculTotal();
  }

   // calcul general cout devis rehetra eo am creer Devis 
   calculTotal(): void {
    const totalServices = this.newDevis.services.reduce((sum, service) => sum + service.coutServices, 0);
    const totalPieces = this.newDevis.pieces.reduce((sum, piece) => sum + (piece.total || 0), 0);

    this.newDevis.totalGeneral = totalServices + totalPieces;
    console.log("Total général:", this.newDevis.totalGeneral);
  }

  // calcul total general eo am champ Modifier devis
  calculTotalModification(): void {
    const totalPieces = this.selectedDevis.pieces?.reduce((sum: number, piece: any) => {
      const totalPiece = piece.quantite * piece.prixUnitaireTTC || 0;  
      return sum + totalPiece;
    }, 0) || 0;
  
    const totalServices = this.selectedDevis.services?.reduce((sum: number, service: any) => {
      return sum + (service.coutServices || 0);
    }, 0) || 0;
  
    this.selectedDevis.totalGeneral = totalPieces + totalServices;
  }

  // si le champ services est vide 
  isFieldEmpty(index: number, fieldName: 'description' | 'coutServices'): boolean {
    return !this.newDevis.services[index]?.[fieldName];
  }
  
  
  

}
