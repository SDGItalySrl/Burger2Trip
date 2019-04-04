import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
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
   MatBadgeModule
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
import { HamburgerResolver } from './hamburgers-detail/hamburger-resolver.service';
import { HamburgerService } from './shared/hamburger.service';
import { OrdineService } from './shared/ordini.service';
import { OrdineComponent } from './ordini/ordini.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HamburgerOptionsModalComponent } from './hamburgers-detail/hamburger-options-modal/hamburger-options-modals.component';
import { FrittiResolver } from './fritti-details/fritti.resolver.service';
import { FrittiService } from './shared/fritti.service';
import { ToastrService } from './common/toastr.service';
import { BevandeService } from './shared/bevande.service';
import { BevandeResolver } from './bevande-details/bevande.resolver.service';
import { CreaHamburgerService } from './shared/crea-hamburger.service';
import { CreaHamburgerResolver } from './crea-hamburger/crea-hamburger.resolver.service';

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
    HamburgerOptionsModalComponent
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
  RouterModule.forRoot(appRoutes),
  HttpClientModule,
  FlexLayoutModule,
  MatCardModule,
  NgbModule,
  HttpClientModule,
  FormsModule,
  ReactiveFormsModule
  ],
  providers: [
    HamburgerService,
    HamburgerResolver,
    OrdineService,
    FrittiService,
    FrittiResolver,
    ToastrService,
    BevandeService,
    BevandeResolver,
    CreaHamburgerService,
    CreaHamburgerResolver
  ],
  entryComponents:[
    HamburgerOptionsModalComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
