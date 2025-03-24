import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevisService {


  constructor(private http: HttpClient) { }

  //Recuperer les utilisateurs
  getAllUser(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/getAllUser`);
  }
  // Récupérer tous les devis
  getAllDevis(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/devis`);
  }

  // Récupérer un devis par ID
  getDevisById(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/devis/${id}`);
  }

  // Créer un devis
  creerDevis(devisData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/devis`, devisData);
  }

  // Modifier un devis
  modifierDevis(id: string, devisData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/devis/${id}`, devisData);
  }

  // Valider un devis
  validerDevis(id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/devis/valider/${id}`, {});
  }

  // Supprimer un devis
  supprimerDevis(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/devis/${id}`);
  }
}
