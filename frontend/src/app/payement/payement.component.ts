import { Component, AfterViewInit, OnInit  } from '@angular/core';
import { PayementService } from '../services/payement/payement.service';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ActivatedRoute } from '@angular/router';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { CommonModule } from '@angular/common';


registerLocaleData(localeFr);


// interface StripePaymentIntentResponse {
//   clientSecret: string;
// }

@Component({
  selector: 'app-payement',
  imports: [ CommonModule],
  templateUrl: './payement.component.html',
  styleUrl: './payement.component.css'
})


export class PayementComponent implements AfterViewInit, OnInit{
  stripe: Stripe | null = null;
  devisId: string=''; 
  total: number=0; 
constructor (private payementservice: PayementService, private route: ActivatedRoute) {}

ngOnInit() {
  this.devisId = this.route.snapshot.paramMap.get('id')!;
  this.total = Number(this.route.snapshot.paramMap.get('total'));
}

async ngAfterViewInit() {
  // this.devisId = this.route.snapshot.paramMap.get('id')!;
  // this.total = Number(this.route.snapshot.paramMap.get('total'));

    const stripe =  await loadStripe('pk_test_51RJFp4GaxXhvLQWgR4ZLKDOqlsEVdhuoaE4HeO0c9xAfv1RbYUQoXF10hyu25fon7Me7vNP3QEtAvZEzDDUOaOOK0042Ht4fgG')
    // console.log('front contenu de stripe',stripe); 
    this.payementservice.payementService(this.devisId, 'mga').subscribe(async (res) => {
    const elements = stripe!.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');
    

    const form = document.getElementById('payment-form')!;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const { error, paymentIntent } = await stripe!.confirmCardPayment(
        res.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );
      if (error) {
        console.error(error.message);
      } else {
        alert('Paiement réussi!');
      }
    });
  });
}}
