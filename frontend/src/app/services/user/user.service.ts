import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  register(nom: string, email: string, motDePasse: string, role: string[], specialite: string[],) {
    // Si role est indéfini ou vide, on met ['client'] par défaut
    const roleToSend = (!role || role.length === 0) ? ['client'] : role;

    const userData = {
      nom,
      email,
      specialite,
      motDePasse,
      role: roleToSend
    };

    return this.http.post(`${this.apiUrl}/create-utilisateur`, userData);
  }

  updatePassword(currentPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    const body = {
      currentPassword,
      newPassword,
      confirmPassword
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Récupère le token JWT de l'utilisateur (stocké dans localStorage ou sessionStorage)
    });

    return this.http.put(`${this.apiUrl}/update-password`, body, { headers });
  }

  getAllUsers() {
    return this.http.get<string[]>(`${this.apiUrl}/get-utilisateur`);
  }

  getUserById(id: string) {
    return this.http.get(`${this.apiUrl}/get-utilisateur/${id}`)
  }

  getUsersDetails(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users-details`);
  }

  updateUser(id: string, userData: any) {
    return this.http.put(`${this.apiUrl}/update-utilisateur/${id}`, userData);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl}/delete-utilisateur/${id}`)
  }
}
