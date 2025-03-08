import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = "http://localhost:5001/garage_api"

  constructor(private http: HttpClient) { }

  // Méthode pour authentifier un utilisateur
  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, {
      email: email,
      motDePasse: password
    });
  }

  getUserRole(): string[] {
    const roles = localStorage.getItem('userRole')
    return roles ? JSON.parse(roles) : []
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Méthode pour sauvegarder le token
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  setUserData(token: string, role: string[]): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', JSON.stringify(role));
  }

  // Méthode pour récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    localStorage.removeItem('token');
  }
}
