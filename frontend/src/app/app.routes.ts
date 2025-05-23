import { Routes } from '@angular/router';
import { RendezvousComponent } from './rendezvous/rendezvous.component';
import { LoginComponent } from './login/login.component';
import { RoleGuard } from './guards/role.guard';
import { ClientPageComponent } from './client-page/client-page.component';
import { MecanicienPageComponent } from './mecanicien-page/mecanicien-page.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './register/register.component';
import { ManagerPageComponent } from './manager-page/manager-page.component';
import { UtilisateursComponent } from './manager-page/pages/utilisateurs/utilisateurs.component';
import { AcceuilComponent } from './manager-page/pages/acceuil/acceuil.component';
import { ProfilComponent } from './profil/profil.component';
import { AcceuilClientComponent } from './client-page/pages/acceuil-client/acceuil-client.component';
import { RendezvousManagerComponent } from './manager-page/pages/rendezvous-manager/rendezvous-manager.component';
import { MecaRendezvousComponent } from './mecanicien-page/pages/meca-rendezvous/meca-rendezvous.component';
import { DevisComponent } from './devis/devis.component';
import { ContactComponent } from './client-page/pages/contact/contact.component';
import { PiecesComponent } from './piece/piece.component';
import { MessagesComponent } from './manager-page/pages/messages/messages.component';
import { PayementComponent } from './payement/payement.component';

export const routes: Routes = [

    // Lorsque l'URL est vide, rediriger vers 'login'
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    // Route pour les clients
    {
        path: 'client-page',
        component: ClientPageComponent,
        canActivate: [RoleGuard],
        data: { role: 'client' },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'acceuil'
            },
            {
                path: 'acceuil',
                component: AcceuilClientComponent,
                data: { role: 'client' }
            },
            {
                path: 'profil',
                component: ProfilComponent,
            },
            {
                path: 'contact',
                component: ContactComponent,
            },
            {
                path: 'create-rendezvous',
                component: RendezvousComponent,
                canActivate: [RoleGuard],
                data: { role: 'client' }
            },
            {
                path: 'devis',
                component: DevisComponent,
                canActivate: [RoleGuard],
                data: { role: 'client' }
            },
            {   
                path: 'payement/:id/:total', 
                component: PayementComponent,
                canActivate: [RoleGuard],
                data: { role: 'client' }

            }, 

        ]
    },
    {
        path: 'mecanicien-page',
        component: MecanicienPageComponent,
        canActivate: [RoleGuard],
        data: { role: 'mecanicien' },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'acceuil'
            },
            {
                path: 'acceuil',
                component: AcceuilClientComponent,
                data: { role: 'mecanicien' }
            },
            {
                path: 'profil',
                component: ProfilComponent,
            },
            {
                path: 'create-rendezvous',
                component: RendezvousComponent,
                canActivate: [RoleGuard],
                data: { role: 'mecanicien' }
            },
            {
                path: 'list-rendezvous',
                component: MecaRendezvousComponent,
                canActivate: [RoleGuard],
                data: { role: 'mecanicien' }
            },
            {
                path: 'devis',
                component: DevisComponent,
                canActivate: [RoleGuard],
                data: { role: 'mecanicien' }
            },
        ]
    },
    {
        path: 'manager-page',
        component: ManagerPageComponent,
        canActivate: [RoleGuard],
        data: { role: 'manager' },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'acceuil'
            },
            {
                path: 'acceuil',
                component: AcceuilComponent,
                data: { role: 'manager' }
            },
            {
                path: 'utilisateurs',
                component: UtilisateursComponent,
                data: { role: 'manager' }
            },
            {
                path: 'rendez-vous',
                component: RendezvousManagerComponent,
                data: { role: 'manager' }
            },
            {
                path: 'profil',
                component: ProfilComponent,
            },
            {
                path: 'messages',
                component: MessagesComponent,
                data: { role: 'manager' }
            },
            {
                path: 'devis',
                component: DevisComponent,
                canActivate: [RoleGuard],
                data: { role: 'manager' }
            },
        ]
    },
];
