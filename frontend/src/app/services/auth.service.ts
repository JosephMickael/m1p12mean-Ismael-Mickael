import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://localhost:5001/garage_api"

  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(private http: HttpClient) { }

  // Méthode pour authentifier un utilisateur
  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, {
      email: email,
      motDePasse: password
    }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  getUserRole(): string[] {
    const roles = localStorage.getItem('userRole')
    return roles ? JSON.parse(roles) : []
  }

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

  getCurrentUser(): Observable<any> {
    const token = this.getToken();

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      return this.http.get(`${this.apiUrl}/current-user`, { headers });
    } else {
      return new Observable(); // Retourne un observable vide si pas de token
    }
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Erreur de décodage du token', error);
        return null;
      }
    }
    return null;
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }
}

