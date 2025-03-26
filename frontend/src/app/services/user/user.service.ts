import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = "http://localhost:5001/garage_api"

  constructor(private http: HttpClient) { }

  private createHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

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

    return this.http.post(`${environment.apiUrl}/create-utilisateur`, userData);
  }

  updatePassword(currentPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    const body = {
      currentPassword,
      newPassword,
      confirmPassword
    }

    const headers = this.createHeader();

    return this.http.put(`${environment.apiUrl}/update-password`, body, { headers });
  }

  getAllUsers() {
    const headers = this.createHeader();
    return this.http.get<string[]>(`${environment.apiUrl}/get-utilisateur`, { headers });
  }

  getAllManagers() {
    const headers = this.createHeader();
    return this.http.get<string[]>(`${environment.apiUrl}/get-managers`, { headers });
  }

  getUserById(id: string) {
    const headers = this.createHeader();
    return this.http.get(`${environment.apiUrl}/get-utilisateur/${id}`, { headers })
  }

  getUsersDetails(): Observable<User[]> {
    const headers = this.createHeader();
    return this.http.get<User[]>(`${environment.apiUrl}/users-details`, { headers });
  }

  updateUser(id: string, userData: any) {
    const headers = this.createHeader();
    return this.http.put(`${environment.apiUrl}/update-utilisateur/${id}`, userData, { headers });
  }

  deleteUser(id: string) {
    const headers = this.createHeader();
    return this.http.delete(`${environment.apiUrl}/delete-utilisateur/${id}`, { headers })
  }
}
