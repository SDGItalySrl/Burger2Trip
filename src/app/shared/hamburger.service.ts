import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import { IHamburger } from './hamburger.model'

@Injectable()
export class HamburgerService{

    /**
     * Ritorna la costante HamburgerList
     */
    getHumburgers(){
        let subject = new Subject();
        setTimeout(() => {
            subject.next(HAMBURGERLIST); 
            subject.complete();
        }, 100);
        return subject
    }
    /**
     * Ritorna l'hamburger richiesto in base all'id
     * @param id idHamburger
     */
    getHamburger(id: number){
        return HAMBURGERLIST.find(hamburger => hamburger.id == id);
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
}

const HAMBURGERLIST : IHamburger[] = [
    {
        id: 1,
        nome: "PLAIN",
        descrizione: "hamburger",
        ingredienti: "hamburger, edamer, bacon, cipolla e insalata",
        prezzo_singolo: 4.50,
        prezzo_menu: 6.50,
        tipologia: "P",
        opzioni : 
            [{
                nomeOpzione: "medio",
                prezzo : 2.50,
            }]
    },
    {
        id: 2,
        nome: "BURGER TRIP",
        descrizione: "hamburger,edamer",
        ingredienti: "hamburger, edamer, pomodoro e insalata",
        prezzo_singolo: 4.00,
        prezzo_menu: 6.00,
        tipologia: "P",
        opzioni : 
            [{
                nomeOpzione: "medio",
                prezzo : 2.50,
            }]
    },
    {
        id: 3,
        nome: "NEW YORK TRIP",
        descrizione: "hamburger,edamer,bacon,cipolla,insalata",
        ingredienti: "" ,
        prezzo_singolo: 6.00,
        prezzo_menu: 8.00,
        tipologia: "P",
        opzioni:
                [{
                    nomeOpzione: "medio",
                    prezzo : 2.50,
                }]
    },
    {
        id: 4,
        nome: "Hamburger Bad Lucy",
        descrizione: "hamburger,cheddar,cipolla,insalata,salsa piccante",
        ingredienti: "hamburger ripieno di cheddar, insalata, pomodoro, cipolla e bacon",
        prezzo_singolo: 6.00,
        prezzo_menu: 10.00,
        tipologia: "P",
        opzioni : 
            [{
                nomeOpzione: "medio",
                prezzo : 2.50,
            }]
    },
    {
        id: 5,
        nome: "Hamburger Hot",
        descrizione: "hamburger,cheddar,cipolla,insalata,salsa piccante",
        ingredienti: "",
        prezzo_singolo: 6.50,
        prezzo_menu: 9.50,
        tipologia: "P",
        opzioni : 
            [{
                nomeOpzione: "medio",
                prezzo : 2.50,
            }]
    },
    {
        id: 6,
      nome: "Hamburger New York Trip",
      descrizione: "hamburger,cheddar,cipolla,insalata,salsa piccante",
      ingredienti: "salmone, rucola, pomodorini, salsa homemade allo yogurt greco con aneto",
      prezzo_singolo: 7.00,
      prezzo_menu: 10.00,
      tipologia: "P",
      opzioni : 
            [{
                nomeOpzione: "medio",
                prezzo : 2.50,
            }]
    },
    {
        id: 7,
        nome: "Hamburger Heavy Trip",
        descrizione: "hamburger,cheddar,cipolla,insalata,salsa piccante",
        ingredienti: "hamburger di verdure, guacamole, pomodoro, cipolla e fontina",
        prezzo_singolo: 5.00,
        prezzo_menu: 7.00,
        tipologia: "P",
        opzioni : 
            [{
                nomeOpzione: "medio",
                prezzo : 2.50,
            }]
    },
    {
        id: 8,
        nome: "Hamburger Hot",
        descrizione: "hamburger,cheddar,cipolla,insalata,salsa piccante",
        ingredienti: "cotoletta di pollo, insalata e pomodoro",
        prezzo_singolo: 6.50,
        prezzo_menu: 9.50,
        tipologia: "P",
        opzioni : 
            [{
                nomeOpzione: "medio",
                prezzo : 2.50,
            }]
    },
    {
        id: 9,
        nome: "Hamburger New York Trip",
        descrizione: "hamburger,cheddar,cipolla,insalata,salsa piccante",
        ingredienti: "",
        prezzo_singolo: 7.00,
        prezzo_menu: 10.00,
        tipologia: "P",
        opzioni : 
            [{
                nomeOpzione: "medio",
                prezzo : 2.50,
            }]
    },
    {
        id: 10,
        nome: "Hamburger Heavy Trip",
        descrizione: "hamburger,cheddar,cipolla,insalata,salsa piccante",
        ingredienti: "hamburger ripieno di zola piccante, rucola e chutney di mango",
        prezzo_singolo: 5.00,
        prezzo_menu: 7.00,
        tipologia: "P",
        opzioni : 
            [{
                nomeOpzione: "medio",
                prezzo : 2.50,
            }]
    }
];