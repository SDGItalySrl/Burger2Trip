import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {
   BrowserAnimationsModule,
   MatButtonModule, 
   MatCheckboxModule,
   MatToolbarModule,
   MatIconModule,
   MatCardModule,
   MatDialogModule,
   MatSelectModule
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
import { HamburgerService } from './hamburgers-detail/hamburger.service';
import { OrdiniComponent } from './ordini/ordini.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HamburgerOptionsModalComponent } from './hamburgers-detail/hamburger-options-modal/hamburger-options-modals.component'
import { OrderItems } from './ordini/orders-items';
import { Orders } from './ordini/orders';

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
    OrdiniComponent,
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
  RouterModule.forRoot(appRoutes),
  HttpClientModule,
  FlexLayoutModule,
  MatCardModule,
  NgbModule
  ],
  providers: [
    HamburgerService,
    HamburgerResolver,
    OrderItems,
    Orders
  ],
  entryComponents:[
    HamburgerOptionsModalComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
