import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  // Variables pour gérer l'affichage et les erreurs
  messageErreur: string | null = null;
  erreurEmail: string | null = null;
  erreurPassword: string | null = null;

  // Formulaire de connexion
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authservice: AuthService
  ) { }

  ngOnInit() {
    // Initialisation du formulaire avec validation
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Méthode pour la connexion
  onSubmit() {
    this.messageErreur = null;
    this.erreurEmail = null;
    this.erreurPassword = null;

    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      if (email && password) {
        this.authservice.login(email, password).subscribe({
          next: (response: any) => {
            console.log('Réponse du serveur:', response);
            if (response.token && response.user) {
              // Sauvegarde du token et des rôles
              this.authservice.setUserData(response.token, response.user.role);

              const userRole = this.authservice.getUserRole();

              // Redirection selon le rôle
              if (userRole.includes('manager')) {
                this.router.navigate(['/manager-page']);
              } else if (userRole.includes('mecanicien')) {
                this.router.navigate(['/mecanicien-page']);
              } else {
                this.router.navigate(['/client-page']);
              }
            } else {
              this.messageErreur = "Réponse du serveur invalide";
            }
          },
          error: (error) => {
            console.error('Erreur de connexion:', error);
            this.messageErreur = "Identifiants incorrects";
          }
        });
      }
    } else {
      if (this.loginForm.get('email')?.errors) {
        this.erreurEmail = "Email invalide";
      }
      if (this.loginForm.get('password')?.errors) {
        this.erreurPassword = "Mot de passe requis";
      }
    }
  }
}
