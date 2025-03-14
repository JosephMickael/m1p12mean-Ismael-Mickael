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

export const routes: Routes = [
    { path: 'create-rendezvous', component: RendezvousComponent },

    // Lorsque l'URL est vide, rediriger vers 'login'
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    // { path: '**', redirectTo: '/manager-page', canActivate: [RoleGuard], data: { role: 'manager' } },
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
            }
        ]
    },

];
