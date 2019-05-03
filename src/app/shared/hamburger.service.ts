import {Injectable} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IHamburger } from './hamburger.model'
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HamburgerService{

    private url = "http://192.168.1.100:8083/spreadsheets?spreadSheetID=1VkMyVpqfR1QG5w4OY6Tu-nACiRGvBi2ehLV2TRcztCw&range=A%3AG&searchFilter&api-version=1.0"
    constructor(private http: HttpClient){ }
    /**
     * Ritorna la costante HamburgerList
     */
    getHamburgers(): Observable<Hamburger>{
        console.log('getting fritti from http request');
        return <Observable<Hamburger>> this.http.get(this.url);   
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
