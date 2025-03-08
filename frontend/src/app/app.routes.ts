import { Routes } from '@angular/router';
import { RendezvousComponent } from './components/rendezvous/rendezvous.component';
import { LoginComponent } from './login/login.component';
import { RoleGuard } from './guards/role.guard';
import { ClientPageComponent } from './client-page/client-page.component';
import { MecanicienPageComponent } from './mecanicien-page/mecanicien-page.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'create-rendezvous', component: RendezvousComponent },
    // Lorsque l'URL est vide, rediriger vers 'login'
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    // Route pour les clients
    {
        path: 'client-page',
        component: ClientPageComponent,
        canActivate: [RoleGuard],
        data: { role: 'client' }
    },
    {
        path: 'mecanicien-page',
        component: MecanicienPageComponent,
        canActivate: [RoleGuard],
        data: { role: 'mecanicien' }
    }
];
