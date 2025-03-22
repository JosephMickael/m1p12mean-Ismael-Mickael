import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { RendezVousModel } from '../models/rendezvous.model';

@Injectable({
  providedIn: 'root'
})

export class RendezVous {

  constructor(private http: HttpClient) { }

  // Creatin de Header Token
  private createHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllRendezVous(): Observable<RendezVousModel[]> {
    return this.http.get<RendezVousModel[]>(`${environment.apiUrl}/all-rendezvous`);
  }

  getTodayRdv() {
    return this.http.get(`${environment.apiUrl}/today-rdv`)
  }

  getNextRdv() {
    return this.http.get(`${environment.apiUrl}/next-rdv`)
  }

  getRdvDetails() {
    return this.http.get(`${environment.apiUrl}/rdv-details`)
  }

  // Mettre à jour un rendez-vous
  updateRendezVous(rendezVousId: string, rendezVousData: any): Observable<any> {
    const headers = this.createHeader();
    return this.http.put(`${environment.apiUrl}/update-rdv/${rendezVousId}`, rendezVousData, { headers });
  }

  // Supprimer un rendez-vous
  deleteRendezVous(rendezVousId: string): Observable<any> {
    const headers = this.createHeader();
    return this.http.delete(`${environment.apiUrl}/delete-rdv/${rendezVousId}`, { headers });
  }

  // Liste de rendezVous du client et du mecanicien 
  listRendezVous(): Observable<any> {
    const headers = this.createHeader();
    return this.http.get<any>(`${environment.apiUrl}/listRendezVous`, { headers });
  }

  //Récupérer les status rendezVous 
  getStatusRendezVous(): Observable<any[]> {
    const headers = this.createHeader();
    return this.http.get<any>(`${environment.apiUrl}/listSatus`, { headers });
  }

  // recup meca  
  recupererMecanicien(): Observable<any[]> {
    const headers = this.createHeader();
    return this.http.get<any[]>(`${environment.apiUrl}/listMecaniciens`, { headers });
  }

  // recuperation des rendezVous disponible donné par le manager
  getAvailableRendezvous(): Observable<any[]> {
    const headers = this.createHeader();
    return this.http.get<any[]>(`${environment.apiUrl}/disponible-rendezVous`, { headers });
  }

  // Recuperer les rendezVous asignés
  getAssignedRendezvous(): Observable<any[]> {
    const headers = this.createHeader();
    return this.http.get<any[]>(`${environment.apiUrl}/list-assignedrendezVous`, { headers });
  }


  // Réservez rendezVous
  reserveRendezVous(rendezVousId: string): Observable<any[]> {
    const headers = this.createHeader();
    return this.http.post<any>(`${environment.apiUrl}/reserve-rendezVous`, { rendezVousId }, { headers });
  }

  // Créer un rendez-vous et assigner automatiquement un mécanicien disponible
  createRendezVous(date: Date, heure: string, services: string): Observable<any> {

    const headers = this.createHeader();
    const status = "réservé";
    return this.http.post<any>(`${environment.apiUrl}/create-rendezVous`, { date, heure, status, services }, { headers })
  }

  // Assigner automatiquement un mecanicien disponible à un rendezaVous 
  assignAvailableMecanicien(rendezVousId: string): Observable<any[]> {
    const headers = this.createHeader();
    return this.http.get<any>(`${environment.apiUrl}/assingn-mecanicien-disponibles-rendezVous`, { headers }).pipe(
      switchMap((mecaniciens: any[]) => {
        if (mecaniciens.length > 0) {
          const mecanicienId = mecaniciens[0].id;
          return this.assignRendezVous(rendezVousId, mecanicienId);
        } else {
          return throwError(() => new Error('Aucun mécanicien disponible'));
        }
      })
    )
  }

  // assigner à un mecanicien un rendezVous
  assignRendezVous(rendezVousId: string, mecanicienId: string): Observable<any> {
    const headers = this.createHeader();
    return this.http.post<any>(`${environment.apiUrl}/assign-mecanicien-rendezVous`, { rendezVousId, mecanicienId }, { headers });
  }

  //Confirmer un rendezVous
  confirmerRendezVous(rendezVousId: string): Observable<any> {
    const headers = this.createHeader();
    return this.http.put<any>(`${environment.apiUrl}/confirmerRendezVous`, { rendezVousId }, { headers });
  }

  // Annulation rendezVous 
  annulerRendezVous(rendezVousId: string): Observable<any> {
    const headers = this.createHeader();
    return this.http.put<any>(`${environment.apiUrl}/annulerRendezVous`, { rendezVousId }, { headers });
  }


}

