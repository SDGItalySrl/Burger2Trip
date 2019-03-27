import {Component} from '@angular/core';
//import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'menu-app',
    templateUrl:'./menu.component.html'
})
export class MenuComponent{
    menu = [
        {
          descrizione: "Crea il tuo hamburger",
          categoria: "s",
          img_path: "../assets/images/preparaHam1.jpg",
          path_url: "crea-hamburger",
          priorita: "1",
          prezzo: "10.00"
        },
        {
          descrizione: "Hamburger",
          categoria: "s",
          img_path: "../assets/images/preparaHam1.jpg",
          path_url: "hamburgers-details",
          priorita: "1",
          prezzo: "10.00"
        },
        {
          descrizione: "Fritti",
          categoria: "n",
          img_path: "../assets/images/preparaHam1.jpg",
          path_url: "fritti-details",
          priorita: "2",
          prezzo: "10.00"
        },      
        {
          descrizione: "Bevande",
          categoria: "n",
          img_path: "../assets/images/preparaHam1.jpg",
          path_url: "bevande details",
          priorita: "3",
          prezzo: "10.00"
        }     
    ]
}