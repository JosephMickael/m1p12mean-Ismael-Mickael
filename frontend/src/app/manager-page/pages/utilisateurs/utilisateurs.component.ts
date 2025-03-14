import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent {
  utilisateurs: any
  userForm: FormGroup
  errorMessage: string = ''
  successMessage: string = ''
  deleteMessage: string = ''
  showPassword: boolean = false

  constructor(private userservice: UserService, private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required]],
      role: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.getAllUsers()
  }

  getAllUsers() {
    this.userservice.getAllUsers().subscribe((response: any) => {
      // Tri par ordre décroissant
      this.utilisateurs = response.sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }, (error) => {
      console.error('Erreur lors du chargement des utilisateurs:', error)
    })
  }

  createUser() {
    if (this.userForm.invalid) {
      return
    }

    // const { nom, email, motDePasse, role: formValues.role ? [formValues.role] : [] } = this.userForm.value

    const formValues = this.userForm.value

    const userData = {
      ...formValues,
      role: formValues.role ? [formValues.role] : []
    };
    console.log(this.userForm.value)

    this.userservice.register(userData.nom, userData.email, userData.motDePasse, userData.role).subscribe({
      next: (response) => {
        this.successMessage = 'Inscription réussie !'
        setTimeout(() => this.successMessage = '', 3000) // 3s
        this.errorMessage = ''
        this.userForm.reset();
        this.getAllUsers()
      }, error: (err) => {
        if (err.error?.message && err.error.message.includes('Utilisateur validation failed')) {
          this.errorMessage = 'Veuillez remplir tous les champs'
        } else {
          this.errorMessage = err.error?.message || 'Une erreur est survenue'
        }
      }
    })
  }

  // Afficher ou pas le mot de passe 
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  deleteUser(userId: string) {
    if (confirm('Etes vous sur de vouloir supprimer cet utilisateur?')) {
      this.userservice.deleteUser(userId).subscribe({
        next: (response: any) => {
          this.deleteMessage = 'Utilisateur supprimé avec succès'
          this.getAllUsers()
          setTimeout(() => this.deleteMessage = '', 3000) // 3s
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err)
          this.errorMessage = err.error?.message || 'Erreur lors de la suppression de l\'utilisateur'
          setTimeout(() => this.errorMessage = '', 3000)
        }
      })
    }
  }
}
