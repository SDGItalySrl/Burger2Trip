import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
   BrowserAnimationsModule,
   MatButtonModule, 
   MatCheckboxModule,
   MatToolbarModule,
   MatIconModule,
   MatCardModule,
   MatDialogModule,
   MatSelectModule,
   MatRadioModule,
   MatListModule,
   MatBadgeModule,
   MatDatepickerModule, 
   MatNativeDateModule, 
   MatInputModule
  } from './material';
import { NavbarComponent} from './nav/nav.component';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { Error404Component } from './error/error404.component';
import { appRoutes } from './routes';
import { HamburgersDetailComponent } from './hamburgers-detail/hamburger.component';
import { FrittiDetailComponent } from './fritti-details/fritti.component';
import { BevandeDetailComponent } from './bevande-details//bevande.component';
import { CreaHamburgerComponent } from './crea-hamburger/crea-hamburger.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HamburgerService } from './shared/hamburger.service';
import { OrdineService } from './shared/ordini.service';
import { OrdineComponent } from './ordini/ordini.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HamburgerOptionsModalComponent } from './hamburgers-detail/hamburger-options-modal/hamburger-options-modals.component';
import { FrittiService } from './shared/fritti.service';
import { ToastrService } from './common/toastr.service';
import { BevandeService } from './shared/bevande.service';
import { CreaHamburgerService } from './shared/crea-hamburger.service';
import { UtenteComponent } from './utente/utente.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpCacheService } from './shared/httpCacheService.service';
import { CacheInterceptor } from './shared/cache.interceptor'
import { StampaComanda } from './utente/stampaComanda.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MenuComponent,
    Error404Component,
    HamburgersDetailComponent,
    CreaHamburgerComponent,
    FrittiDetailComponent,
    BevandeDetailComponent,
    OrdineComponent,
    HamburgerOptionsModalComponent,
    OrdineComponent,
    CreaHamburgerComponent,
    UtenteComponent,
    StampaComanda
  ],
  imports: [
  BrowserModule,
  BrowserAnimationsModule,
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatIconModule,
  MatDialogModule,
  MatSelectModule,
  MatRadioModule,
  MatListModule,
  MatBadgeModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  RouterModule.forRoot(appRoutes),
  HttpClientModule,
  FlexLayoutModule,
  MatCardModule,
  NgbModule,
  HttpClientModule,
  FormsModule,
  ReactiveFormsModule,
  ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    HamburgerService,
    OrdineService,
    FrittiService,
    ToastrService,
    BevandeService,
    CreaHamburgerService,
    MatDatepickerModule,
    HttpCacheService,
    {provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true}
  ],
  entryComponents:[
    HamburgerOptionsModalComponent,
    StampaComanda
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
