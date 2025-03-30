import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevisService {

  constructor(private http: HttpClient) { }

  // Création de l'en-tête avec le token
  private createHeader(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Récupérer les utilisateurs pour la gestion de devis
  getAllUserDevis(): Observable<any> {
    const headers = this.createHeader(); 
    return this.http.get(`${environment.apiUrl}/get-utilisateur-devis`, { headers });
  }

  // Récupérer tous les devis
  getAllDevis(): Observable<any> {
    const headers = this.createHeader();
    return this.http.get(`${environment.apiUrl}/devis`, { headers });
  }

  // Récupérer un devis par ID
  getDevisById(id: string): Observable<any> {
    const headers = this.createHeader();
    return this.http.get(`${environment.apiUrl}/devis/${id}`, { headers });
  }

  // Créer un devis
  creerDevis(devisData: any): Observable<any> {
    const headers = this.createHeader();
    return this.http.post(`${environment.apiUrl}/create-devis`, devisData, { headers });
  }

  // Modifier un devis
  modifierDevis(id: string, devisData: any): Observable<any> {
    const headers = this.createHeader();
    return this.http.put(`${environment.apiUrl}/modifier-devis/${id}`, devisData, { headers });
  }

  // Valider un devis
  validerDevis(id: string): Observable<any> {
    const headers = this.createHeader();
    return this.http.put(`${environment.apiUrl}/valider-devis/${id}`, {}, { headers });
  }

  // Supprimer un devis
  supprimerDevis(id: string): Observable<any> {
    const headers = this.createHeader();
    return this.http.delete(`${environment.apiUrl}/supprimer-devis/${id}`, { headers });
  }

// //Envoyer devis vers mail 
// sendDevisMail(): Observable<any> {

//}
}
