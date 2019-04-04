import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component'
import { Error404Component } from './error/error404.component';
import { HamburgersDetailComponent } from './hamburgers-detail/hamburger.component';
import { FrittiDetailComponent } from './fritti-details/fritti.component';
import { BevandeDetailComponent } from './bevande-details//bevande.component';
import { CreaHamburgerComponent } from './crea-hamburger/crea-hamburger.component';
import { HamburgerResolver } from './hamburgers-detail/hamburger-resolver.service';
import { FrittiResolver } from './fritti-details/fritti.resolver.service';
import { BevandeResolver } from './bevande-details/bevande.resolver.service';
import { CreaHamburgerResolver } from './crea-hamburger/crea-hamburger.resolver.service';

export const appRoutes: Routes = [
    {path: '404', component: Error404Component},
    {path: 'menu', component: MenuComponent},
    {path: 'menu/hamburgers-details', component: HamburgersDetailComponent, resolve: {hamburgers: HamburgerResolver} },
    {path: 'menu/fritti-details', component: FrittiDetailComponent, resolve: {fritti: FrittiResolver}},
    {path: 'menu/bevande-details', component: BevandeDetailComponent, resolve: {bevande: BevandeResolver}},
    {path: 'menu/crea-hamburger', component: CreaHamburgerComponent, resolve: {ingredienti: CreaHamburgerResolver, ingredientiPuliti: CreaHamburgerResolver}},
    {path: '', redirectTo: '/menu', pathMatch:'full'}
];