import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component'
import { Error404Component } from './error/error404.component';
import { HamburgersDetailComponent } from './hamburgers-detail/hamburger.component';
import { FrittiDetailComponent } from './fritti-details/fritti.component';
import { BevandeDetailComponent } from './bevande-details//bevande.component';
import { CreaHamburgerComponent } from './crea-hamburger/crea-hamburger.component';
import { OrdineComponent } from './ordini/ordini.component';
import { UtenteComponent } from './utente/utente.component';

export const appRoutes: Routes = [
    {path: '404', component: Error404Component},
    {path: 'menu', component: MenuComponent},
    {path: 'menu/hamburgers-details', component: HamburgersDetailComponent },
    {path: 'menu/fritti-details', component: FrittiDetailComponent },
    {path: 'menu/bevande-details', component: BevandeDetailComponent},
    {path: 'menu/crea-hamburger', component: CreaHamburgerComponent},
    {path: 'utente', component: UtenteComponent},
    {path: 'ordine', component: OrdineComponent},
    {path: '', redirectTo: '/menu', pathMatch:'full'}
];