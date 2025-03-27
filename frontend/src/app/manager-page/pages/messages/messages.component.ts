import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../../services/contact/contact.service';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../../services/email/email.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  messages: any[] = []
  emailSuccessMessage: string = ''
  emailErrorMessage: string = ''
  selectedClient: any = null;
  emailForm: FormGroup
  isLoading: boolean = false
  deleteMsg: string = ''

  constructor(private contactservice: ContactService, private authservice: AuthService, private emailservice: EmailService, private formBuilder: FormBuilder) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.getMessages()
  }

  // Liste des messages
  getMessages() {
    this.contactservice.getManagerMessages().subscribe({
      next: (response) => {
        this.messages = response

        // Tri par date
        this.messages.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })

      }, error: error => {
        console.error("Une erreur est survenue: ", error.message)
      }
    })
  }

  // Afficher l'email du client directement dans le modal
  prepareClientEmail(client: any) {
    this.selectedClient = client

    this.emailForm.patchValue({
      email: client.email
    })
  }

  // Envoi reponse du manager par mail
  sendEmail() {
    const { email, subject, message } = this.emailForm.value
    this.isLoading = true

    this.emailservice.sendEmail(email, subject, message).subscribe({
      next: (response: any) => {
        this.emailSuccessMessage = 'Email envoyé avec succès!'
        this.isLoading = false
        setTimeout(() => {
          this.emailSuccessMessage = ''
        }, 2000);
      }, error: error => {
        console.error("Une erreur s'est produite : ", error.message)
        this.emailErrorMessage = 'Email non envoyé'
        setTimeout(() => this.emailErrorMessage = '', 2000)
      }
    })
  }

  markAsRead(messageId: string) {
    const managerId = this.authservice.getCurrentUser().userId

    this.contactservice.markAsRead(messageId, managerId).subscribe({
      next: (response) => {
        this.getMessages()
      }, error: error => {
        console.error("Erreur: ", error.message)
      }
    })
  }

  // Suppression d'un message
  deleteMessage(messageId: string) {
    if (confirm('Etes vou sûr de vouloir supprimer ce message ?')) {
      this.contactservice.deleteMessage(messageId).subscribe({
        next: (response) => {
          this.getMessages()
          this.deleteMsg = 'Message supprimé avec succès'
          setTimeout(() => this.deleteMsg = '', 2000)
        }, error: error => {
          console.error("Une erreur s'est produite : ", error.message)
          this.deleteMsg = 'Message non supprimé'
          setTimeout(() => this.deleteMsg = '', 2000)
        }
      })
    }
  }
}
