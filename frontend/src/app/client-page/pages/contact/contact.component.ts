import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { ContactService } from '../../../services/contact/contact.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup
  clientId: string = ''
  successMessage: string = ''
  errorMessage: string = ''

  constructor(private formBuilder: FormBuilder, private authservice: AuthService, private userservice: UserService, private contactservice: ContactService) {
    this.contactForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.clientId = this.authservice.getCurrentUser().userId
  }

  sendMessage(managersId: any) {
    const { title, content } = this.contactForm.value

    this.contactservice.sendMessage(this.clientId, managersId, title, content).subscribe({
      next: (response) => {
        this.successMessage = response.message
        this.contactForm.reset()
        setTimeout(() => this.successMessage = '', 2000);
      }, error: error => {
        this.errorMessage = "Une erreur s'est produite"
        console.error("Une erreur s'est produite: ", error.message)
        setTimeout(() => this.successMessage = '', 2000);
      }
    })
  }

  onSubmit() {
    this.userservice.getAllManagers().subscribe({
      next: (response) => {
        console.log(response)
        const managersId = response.map((manager: any) => manager._id)
        this.sendMessage(managersId)
      }, error: error => {
        console.error("Erreur lors de la récupération des managers: ", error.message)
      }
    })
  }
}
