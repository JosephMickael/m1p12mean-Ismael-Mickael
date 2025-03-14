import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent implements OnInit {
  utilisateurs: any[] = [];
  userForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  deleteMessage: string = '';
  showPassword: boolean = false;
  selectedUser: any = null;
  isEditMode: boolean = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required]],
      role: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        // Tri par ordre décroissant
        this.utilisateurs = response.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    });
  }

  prepareNewUser() {
    this.resetForm();
    this.isEditMode = false;
    this.selectedUser = null;

    // // Réinitialiser les validateurs pour le mode création
    // this.userForm.get('motDePasse')?.setValidators([Validators.required]);
    // this.userForm.get('motDePasse')?.updateValueAndValidity();
  }

  prepareEditUser(user: any) {
    this.resetForm();
    this.isEditMode = true;
    this.selectedUser = user;

    // // Ajuster les validateurs pour le mode édition (mot de passe non requis)
    // this.userForm.get('motDePasse')?.clearValidators();
    // this.userForm.get('motDePasse')?.updateValueAndValidity();

    this.userForm.patchValue({
      nom: user.nom,
      email: user.email,
      motDePasse: user.motDePasse,
      role: user.role
    });
  }

  resetForm() {
    this.userForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  submitUserForm() {
    if (this.userForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser() {
    const formValues = this.userForm.value;
    const userData = {
      ...formValues,
      role: formValues.role ? [formValues.role] : []
    };

    this.userService.register(userData.nom, userData.email, userData.motDePasse, userData.role).subscribe({
      next: (response) => {
        this.successMessage = 'Utilisateur enregistré !';
        setTimeout(() => {
          this.successMessage = '';
          // Le modal sera fermé via le bouton "Annuler" avec data-bs-dismiss
        }, 2000);
        this.getAllUsers();
      },
      error: (err) => {
        if (err.error?.message && err.error.message.includes('Utilisateur validation failed')) {
          this.errorMessage = 'Veuillez remplir tous les champs';
        } else {
          this.errorMessage = err.error?.message || 'Une erreur est survenue';
        }
      }
    });
  }

  updateUser() {
    if (this.userForm.valid && this.selectedUser) {
      const formValues = this.userForm.value;
      const userData = {
        nom: formValues.nom,
        email: formValues.email,
        // motDePasse: formValues.motDePasse,
        role: formValues.role
      };

      // // Ajouter le mot de passe seulement s'il est fourni
      // if (formValues.motDePasse) {
      //   userData['motDePasse'] = formValues.motDePasse;
      // }

      console.log('RETURN', userData)

      this.userService.updateUser(this.selectedUser._id, userData).subscribe({
        next: (response) => {
          this.successMessage = 'Mise à jour effectuée';
          setTimeout(() => this.successMessage = '', 2000);
          this.getAllUsers();
        },
        error: (err) => {
          if (err.error?.message && err.error.message.includes('Utilisateur validation failed')) {
            this.errorMessage = 'Veuillez remplir tous les champs';
          } else {
            this.errorMessage = err.error?.message || 'Une erreur est survenue';
          }
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  deleteUser(userId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      this.userService.deleteUser(userId).subscribe({
        next: (response: any) => {
          this.deleteMessage = 'Utilisateur supprimé avec succès';
          this.getAllUsers();
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
}