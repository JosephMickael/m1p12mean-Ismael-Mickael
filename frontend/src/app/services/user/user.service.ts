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
    const userData: any = { nom, email, motDePasse, role: [role] };

    if (role && role.length > 0) {
      userData.role = role;
    }

    return this.http.post(`${this.apiUrl}/create-utilisateur`, userData);
  }

  getAllUsers() {
    return this.http.get<string[]>(`${this.apiUrl}/get-utilisateur`);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl}/delete-utilisateur/${id}`)
  }
}
