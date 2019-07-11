import {Injectable} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IHamburger } from './hamburger.model'
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class HamburgerService{

    constructor(private http: HttpClient){ }
    /**
     * Ritorna la costante HamburgerList
     */
    getHamburgers(): Observable<Hamburger>{
        return <Observable<Hamburger>> this.http.get(environment.hamburgerSheet);   
    }

    /**
     * Calcola il totale del prodotto sommando il prezzo delle opzioni
     * @param array objProdotto
     */
    calcoloPrezzoTotale(objProdotto){
        try {
            for (let index = 0; index < objProdotto.opzioni.length; index++) {
                if(objProdotto.opzioni[index].prezzo != undefined){
                    objProdotto.prezzo += objProdotto.opzioni[index].prezzo; 
                }
            }
            return objProdotto.prezzo; 
        } 
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Calcolo il prezzo totale per il componente hamburger contenente ingredienti con quantita sia positiva che negativa
     * @param objProdotto oggetto prodotto
     */
    calcoloPrezzoHamburger(objProdotto){
        try {
            objProdotto.prezzo = 0;
            for (let index = 0; index < objProdotto.opzioni.length; index++) {
                if(objProdotto.opzioni[index].prezzo != undefined && objProdotto.opzioni[index].valueQuantita != "N"){
                    objProdotto.prezzo += objProdotto.opzioni[index].prezzo; 
                }
            }
            return objProdotto.prezzo; 
        } 
        catch (error) {
            console.log(error);
        }
    }
}

export interface Hamburger{
    rows: Array<IHamburger>;
}
