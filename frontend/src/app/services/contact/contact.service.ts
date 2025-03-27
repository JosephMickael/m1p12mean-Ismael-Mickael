import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  headers: any

  constructor(private http: HttpClient) {
    this.headers = this.createHeader()
  }

  private createHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Envoyer un message (client)
  sendMessage(clientId: string, managersId: any, title: string, content: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/send`, { clientId, managersId, title, content }, { headers: this.headers });
  }

  // Récupérer les messages pour les managers
  getManagerMessages(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/managers/messages`, { headers: this.headers });
  }

  // Marquer un message comme lu
  markAsRead(messageId: string, managerId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/read/${messageId}`, { managerId }, { headers: this.headers });
  }

  // suppression message
  deleteMessage(messageId: string) {
    return this.http.delete(`${environment.apiUrl}/message/${messageId}`, { headers: this.headers })
  }
}
