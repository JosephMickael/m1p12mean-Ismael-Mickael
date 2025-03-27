import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Piece } from '../models/piece.model';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-pieces',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css'],
  imports: [ReactiveFormsModule]
})
export class PiecesComponent implements OnInit {

  @Output() pieceAdded = new EventEmitter<Piece>(); 

  pieces: Piece[] = [];
  pieceForm: FormGroup;
  selectedPiece: Piece | null = null;

  constructor(private fb: FormBuilder) {
    // Initialiser le formulaire
    this.pieceForm = this.fb.group({ 
      nom: ['', Validators.required],
      reference: ['', Validators.required],
      prixUnitaireHT: [0, Validators.required],
      prixUnitaireTTC: [0, Validators.required],
      quantite: [0, Validators.required], 
      total: [0, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  // Ajouter une pièce et l'envoyer au DevisComponent
  addPiece(): void {
    if (this.pieceForm.valid) {
      const newPiece: Piece = {
        ...this.pieceForm.value,
        total: this.pieceForm.value.prixUnitaireHT * this.pieceForm.value.quantite
      };

      console.log("Valeur de newPiece", newPiece);
      this.pieceAdded.emit(newPiece);
      
      //this.pieceForm.reset();  Misy BUGGG

    // ALEO reinitilisena tsirairay
    this.pieceForm.controls['nom'].setValue('');
    this.pieceForm.controls['reference'].setValue('');
    this.pieceForm.controls['prixprixUnitaireTTC'].setValue(0);
    this.pieceForm.controls['prixUnitaireHT'].setValue(0);
    this.pieceForm.controls['quantite'].setValue(0);
    }
  }

 
}
