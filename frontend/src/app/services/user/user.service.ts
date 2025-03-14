import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = "http://localhost:5001/garage_api"

  constructor(private http: HttpClient) { }

  // Méthode pour enregistrer un nouvel utilisateur
  register(nom: string, email: string, motDePasse: string, role: string[]) {
    // Si role est indéfini ou vide, utilisez ['client'] par défaut
    const roleToSend = (!role || role.length === 0) ? ['client'] : role;

    const userData = {
      nom,
      email,
      motDePasse,
      role: roleToSend
    };

    return this.http.post(`${this.apiUrl}/create-utilisateur`, userData);
  }

  getAllUsers() {
    return this.http.get<string[]>(`${this.apiUrl}/get-utilisateur`);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl}/delete-utilisateur/${id}`)
  }
}
