import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup
  errorMessage: string = ''
  successMessage: string = ''

  constructor(private formbuilder: FormBuilder, private userservice: UserService) {
    this.registerForm = formbuilder.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required]],
      role: [[]] // Par défaut vide, si non spécifié, le backend mettra "client"
    })
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return
    }

    const { nom, email, motDePasse, role } = this.registerForm.value

    this.userservice.register(nom, email, motDePasse, role).subscribe({
      next: (response) => {
        console.log('Inscription réussie', response);
        this.successMessage = 'Inscription réussie !'
        this.errorMessage = ''
        this.registerForm.reset()
      },
      error: (err) => {
        console.error('Erreur lors de l’inscription', err);
        this.errorMessage = err.error?.message || 'Une erreur est survenue';
        this.successMessage = ''
      }
    })
  }
}