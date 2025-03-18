import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  currentUser: any
  showCurrentPassword = false
  showNewPassword = false
  showConfirmPassword = false
  successMessage: string = ''
  errorMessage: string = ''

  passwordForm: FormGroup
  userForm: FormGroup

  constructor(private formBuilder: FormBuilder, private authservice: AuthService, private userservice: UserService, private router: Router) {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.checkPasswords })

    this.userForm = this.formBuilder.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialite: ''
    });
  }

  ngOnInit() {
    this.currentUser = this.authservice.getCurrentUser()
    console.log(this.currentUser.role[0])
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  }


  onSubmit() {
    if (this.passwordForm.invalid) {
      return
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value

    this.userservice.updatePassword(currentPassword, newPassword, confirmPassword).subscribe({
      next: (response) => {
        this.router.navigate(['/manager-page/profil'])
        this.successMessage = response.message
        this.passwordForm.reset()
        setTimeout(() => this.successMessage = '', 2000)
      }, error: (error) => {
        this.errorMessage = error.error?.message || 'Une erreur est survenue';
        setTimeout(() => this.errorMessage = '', 2000)
      }
    })
  }

  updateInformations() {
    if (this.userForm.invalid) {
      return;
    }

    const formValues = this.userForm.value;
    const userData = {
      nom: formValues.nom,
      email: formValues.email,
      specialite: formValues.specialite
    }

    this.userservice.updateUser(this.currentUser.userId, userData).subscribe({
      next: (response: any) => {
        this.currentUser.nom = response.nom;
        this.currentUser.email = response.email;
        this.currentUser.specialite = response.specialite;
        this.successMessage = 'Mise à jour effectuée';
        setTimeout(() => this.successMessage = '', 2000);
      }, error: (err) => {
        if (err.error?.message && err.error.message.includes('Utilisateur validation failed')) {
          this.errorMessage = 'Veuillez remplir tous les champs';
        } else {
          this.errorMessage = err.error?.message || 'Une erreur est survenue';
        }
      }
    })
  }

  prepareEditUser(user: any) {
    this.userForm.patchValue({
      nom: user.nom,
      email: user.email,
      specialite: user.specialite
    });
  }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getFirstLetterUpperCase(str: string) {
    return str ? str.charAt(0).toUpperCase() : "";
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

  // Derniere connexion (A tester)
  formatLastLogin(): string {
    const lastLogin = localStorage.getItem('lastLogin');

    if (!lastLogin) {
      return 'Première connexion';
    }

    const lastLoginDate = new Date(lastLogin);
    const today = new Date();

    // Vérifie si la date est aujourd'hui
    if (lastLoginDate.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${lastLoginDate.getHours().toString().padStart(2, '0')}:${lastLoginDate.getMinutes().toString().padStart(2, '0')}`;
    }

    // Vérifie si la date est hier
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastLoginDate.toDateString() === yesterday.toDateString()) {
      return `Hier à ${lastLoginDate.getHours().toString().padStart(2, '0')}:${lastLoginDate.getMinutes().toString().padStart(2, '0')}`;
    }

    // Sinon, afficher la date complète
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    return lastLoginDate.toLocaleDateString('fr-FR', options);
  }
}
