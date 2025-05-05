import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js'; 


@Injectable({
  providedIn: 'root'
})
export class PayementService {
  headers: any

  constructor(private http:HttpClient) { 
    this.headers = this.createHeader()
  }
  private createHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

   payementService(devisId: string, currency: string) {
    // const stripe = await ('pk_test_51RJFp4GaxXhvLQWgR4ZLKDOqlsEVdhuoaE4HeO0c9xAfv1RbYUQoXF10hyu25fon7Me7vNP3QEtAvZEzDDUOaOOK0042Ht4fgG')
    return this.http.post<any>(`${environment.apiUrl}/payement`, { devisId, currency } , { headers: this.headers})
  }
}
