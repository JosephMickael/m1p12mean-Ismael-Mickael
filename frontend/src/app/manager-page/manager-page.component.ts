import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';
import { ContactService } from '../services/contact/contact.service';

@Component({
  selector: 'app-manager-page',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './manager-page.component.html',
  styleUrl: './manager-page.component.css'
})
export class ManagerPageComponent {
  user: any;
  isSidebarCollapsed: boolean = false;
  unreadCount: any = 0;
  messages: any[] = [];

  constructor(
    private router: Router,
    private authservice: AuthService,
    private contactservice: ContactService
  ) { }

  ngOnInit(): void {
    this.user = this.authservice.getCurrentUser()
    this.loadMessages()
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Récuperation des messages
  loadMessages(): void {
    this.contactservice.getManagerMessages().subscribe({
      next: (response) => {
        this.messages = response
        this.updateUnreadCount()
      }, error: error => {
        console.error("Une erreur est survenue: ", error.message)
      }
    });
  }

  // Compter les messages pas encore lu
  updateUnreadCount(): void {
    this.unreadCount = this.messages.filter((message) => message.readBy.length == 0).length;
  }

  logout() {
    this.authservice.logout();
    this.router.navigate(['/login']);
  }

}

