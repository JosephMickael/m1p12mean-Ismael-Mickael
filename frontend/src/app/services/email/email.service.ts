import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  headers: any

  constructor(private http: HttpClient) {
    this.headers = this.createHeader()
  }

  private createHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  sendEmail(email: string, subject: string, message: string) {
    return this.http.post(`${environment.apiUrl}/send-email`, { email, subject, message }, { headers: this.headers });
  }

  sendDevisMail(email: string, subject: string, message: string, attachment: File) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('fichierPdf', attachment);  

    return this.http.post(`${environment.apiUrl}/send-devisMail`, formData, { headers: this.headers })
  }
}
