import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
  // filtres
  filteredUsers: any[] = []
  searchText: string = ''
  selectedRole: string = ''
  roles: string[] = ['client', 'mecanicien', 'manager']

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required]],
      role: [[], Validators.required],
      specialite: ['']
    });
  }

  ngOnInit() {
    this.getAllUsers();

    this.userForm.get('role')?.valueChanges.subscribe(role => {
      if (role !== 'mecanicien') {
        this.userForm.get('specialite')?.setValue('');
      }
    });
  }

  onSearchChange() {
    this.filterUsers();
  }

  onRoleChange() {
    this.filterUsers();
  }

  filterUsers() {
    this.filteredUsers = this.utilisateurs.filter(user => {
      // Filtre par recherche (texte)
      const matchesSearch = user.nom?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(this.searchText.toLowerCase());

      // Filtre par role
      let matchesRole = true;
      if (this.selectedRole) {
        if (Array.isArray(user.role)) {
          matchesRole = user.role.includes(this.selectedRole);
        } else {
          matchesRole = user.role === this.selectedRole;
        }
      }

      return matchesSearch && matchesRole;
    });
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        // Tri par ordre décroissant
        this.utilisateurs = response.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        console.log(this.utilisateurs[0])
        this.filteredUsers = [...this.utilisateurs];
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
  }

  // Remplissage du modal avec les informations de l'utilisateur
  prepareEditUser(user: any) {
    this.resetForm();
    this.isEditMode = true;
    this.selectedUser = user;

    //  Afficher le champ specialité si role mecanicien
    const isMecanicien = user.role === 'mecanicien' || (Array.isArray(user.role) && user.role.includes('mecanicien'));

    this.userForm.get('role')?.setValue(Array.isArray(user.role) ? user.role[0] : user.role);

    this.userForm.patchValue({
      nom: user.nom,
      email: user.email,
      motDePasse: user.motDePasse,
      specialite: isMecanicien ? (user.specialite || '') : ''
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

    this.userService.register(userData.nom, userData.email, userData.motDePasse, userData.role, userData.specialite).subscribe({
      next: (response) => {

        const formData = { ...this.userForm.value };

        if (formData.role === 'mecanicien' && formData.specialite) {
          formData.specialite = formData.specialite.split(',').map((item: string) => item.trim()).filter((item: string) => item);
        } else {
          formData.specialite = [];
        }

        this.successMessage = 'Utilisateur enregistré !';
        setTimeout(() => this.successMessage = '', 2000);
        this.getAllUsers()
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
        role: formValues.role,
        specialite: formValues.specialite
      };

      this.userService.updateUser(this.selectedUser._id, userData).subscribe({
        next: (response) => {

          const formData = { ...this.userForm.value };

          if (formData.role === 'mecanicien' && formData.specialite) {
            formData.specialite = formData.specialite.split(',').map((item: string) => item.trim()).filter((item: string) => item);
          } else {
            formData.specialite = [];
          }

          this.successMessage = 'Mise à jour effectuée';
          setTimeout(() => this.successMessage = '', 2000);
          this.getAllUsers()
          this.selectedRole = ''
          this.searchText = ''
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
          this.getAllUsers()
          this.selectedRole = ''
          this.searchText = ''
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