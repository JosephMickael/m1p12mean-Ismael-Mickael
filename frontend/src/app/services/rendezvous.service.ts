import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
 
export class RendezVous {

  constructor (private http: HttpClient)  {}

  // recuperation des rendezVous disponible donné par le manager
  getAvailableRendezvous(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/disponible-rendezVous`);
  }

  // Réservez rendezVous
  reserveRendezVous(rendezVousId : string, clientName: string): Observable <any[]> {
    return this.http.post<any>(`${environment.apiUrl}/reserve-rendezVous`, { rendezVousId, clientName});
  }

  //creer un rendezVous et assigner automatiquement un mecanicien disponible 
  createRendezVous(date: Date, time: string): Observable<any>  {
    return this.http.post<any>(`${environment.apiUrl}/create-rendezVous`, {date, time}).pipe(
      switchMap((rendezVous: any) => 
      this.assignAvailableMecanicien(rendezVous.id).pipe(
        map(()=>rendezVous)
      ))   
    );
  }

  // Assigner auto un mecanicien disponible à un rendezaVous 
  assignAvailableMecanicien(rendezVousId : string): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/assingn-mecanicien-disponibles-rendezVous`).pipe(
      switchMap((mecaniciens: any[]) => {
        if (mecaniciens.length > 0) {
        const mecanicienId = mecaniciens[0].id; 
        return this.assignRendezVous(rendezVousId, mecanicienId);
        } else { 
          return throwError(()=> new Error('Aucun mécanicien disponible')); 
        }
      })
    ) 
  } 

  // assigner à un mecanicien un rendezVous
  assignRendezVous(rendezVousId: string, mecanicienId: string): Observable<any[]> {
    return this.http.post<any>(`${environment.apiUrl}/assign-mecanicien`, { rendezVousId, mecanicienId});
  }


}

