import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  imports: [CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  currentUser: any

  constructor(private authservice: AuthService) { }

  ngOnInit() {
    this.currentUser = this.authservice.getCurrentUser()

    console.log(this.currentUser)
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
  formatLastLogin(dateString: string): string {
    if (!dateString) return 'Première connexion';

    const lastLogin = new Date(dateString);
    const today = new Date();

    // Vérifie si la date est aujourd'hui
    if (lastLogin.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${lastLogin.getHours().toString().padStart(2, '0')}:${lastLogin.getMinutes().toString().padStart(2, '0')}`;
    }

    // Vérifie si la date est hier
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastLogin.toDateString() === yesterday.toDateString()) {
      return `Hier à ${lastLogin.getHours().toString().padStart(2, '0')}:${lastLogin.getMinutes().toString().padStart(2, '0')}`;
    }

    // Sinon, afficher la date complète
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }
}
