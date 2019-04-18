import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <nav-bar></nav-bar>
  <div class="main-router-outlet">
  <div class="container">
    <div class="jumbotron">
        <div class="row">        
            <div class="col-md-8 col-sm-8">
                <h1>welcome</h1>
                <p>Francesca Vegetti</p>
                <h6>Please select something from the menu</h6>
            </div>
            
            <div class="col-md-4 col-sm-4 alergy-alert">
                <hr>
                <div class="row">
                  <div class="col-md-1 col-sm-1"><i class="fas fa-exclamation-triangle fa-2x"></i></div>
                  <div class="col-md-11 col-sm-11">
                  <p>Se hai un'allergia o un'intolleranza alimentare (o se una persona per la quale stai effettuando un ordine ne ha) indicacelo nelle note a fine acquisto
                  </p>
                  </div>
                </div>                  
            </div>
        </div>
    </div>
  </div>
    <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent {
  title = 'BurgerTwoTrip';
}
