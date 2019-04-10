import { Injectable } from '@angular/core';
import { IOrdine, IProdotto, IOpzioni } from './ordine.model';
import { OrdineComponent } from '../ordini/ordini.component';
import { BehaviorSubject } from 'rxjs';



@Injectable()
export class OrdineService{
    ordine: Ordine;
    private ordineListProdotti;
    ordineListAggiornato; 
    private prezzoTotale;
    prezzoTotaleAggiornato;

    constructor(){
        this.ordine = new Ordine();
        this.ordineListProdotti = new BehaviorSubject(this.ordine.prodotti);
        this.ordineListAggiornato = this.ordineListProdotti.asObservable(); //VARIABILE UTILIZZATA DAI COMPONENTI PER INVIARE/RICEVERE DATI
        this.prezzoTotale = new BehaviorSubject<number>(this.ordine.totale);
        this.prezzoTotaleAggiornato = this.prezzoTotale.asObservable(); //VARIABILE UTILIZZATA DAI COMPONENTI PER INVIARE/RICEVERE DATI
    }

    /**
     * Inserisce il prodotto nell'oggetto Ordine
     * @param ObjProdotto 
     */
    inserisciProdotto(prodotto: Prodotto){
        let res: boolean = false;
        try {
            const nextId = this.ordine.prodotti.length;            
            prodotto.id = nextId;
            this.ordine.prodotti.push(prodotto);
            res = true;
        } 
        catch (error) {
            console.log(error.message);
            res = false;
        }
        //AGGIORNO LA LISTA ORDINE UTILIZZATA DALL'ORDINE COMPONENT
        this.ordineListProdotti.next(this.ordine.prodotti);
        this.calcoloPrezzoTotale();
        return res;
    }

    /**
     * Elimina il prodotto selezionato dall'array ordine
     * @param prodotto id prodotto
     */
    eliminaProdotto(id: number){
        try {
            //Ricavo l'indice del prodotto attraverso l'idProdotto
            let indiceProdotto = this.ordine.prodotti.map(function(prodotto) {return prodotto.id;}).indexOf(id)
            this.ordine.prodotti.splice(indiceProdotto, 1);
            console.log(this.ordine.prodotti)
            //Aggiorno la lista dei prodotti per la ordini.component
            this.ordineListProdotti.next(this.ordine.prodotti);
            this.calcoloPrezzoTotale();  // ricalcola il prezzoTotale
            console.log(this.prezzoTotale)
        } 
        catch (error) {
            console.log(error)
        }
    }

    /**
     * Elimina l'opzione dal prodotto selezionato
     * @param idProdotto id prodotto
     * @param idOpzione id opzione
     */
    eliminaOpzioniProdotto(idProdotto: number, idOpzione: number){
        try {
            //Ricavo l'indice dell'opzione attraverso l'id opzione
            let indiceOpzione = this.ordine.prodotti[idProdotto].opzioni.map(function(opzione) {return opzione.id;}).indexOf(idOpzione);
            this.ordine.prodotti[idProdotto].opzioni.splice(indiceOpzione, 1);
            console.log(this.ordine.prodotti[idProdotto].opzioni)
            //Aggiorno la lista dei prodotti per la ordini.component
            this.ordineListProdotti.next(this.ordine.prodotti);
            this.calcoloPrezzoTotale();  // ricalcola il prezzoTotale
        } 
        catch (error) {
            console.log(error)
        }
    }

    /**
     * Ritorna l'ordine salvato in locale
     */
    getOrdine(): Ordine{
        return this.ordine;
    }

    /**
     * Calcola il prezzo totale dell'ordine
     */
    calcoloPrezzoTotale(){
        try {
            this.ordine.totale=0;
            for (let index = 0; index < this.ordine.prodotti.length; index++) {
                this.ordine.totale += this.ordine.prodotti[index].prezzo;
            }    
            this.prezzoTotale.next(this.ordine.totale);
        } 
        catch (error) {
            console.log(error);
        }
    }
}
export class Ordine implements IOrdine {
    prodotti?: Prodotto[];
    constructor(){
        this.prodotti = [];
    }
    id: number;
    totale: number;
    nomeCliente: string;
    consegnaDomicilio: boolean;
    citta: string;
    cap: number;
    indirizzo: string;
    citofono: string;
    internoScala?: string;
    numeroTelefono: number;
    data: Date;
    orario: string;
    note?: string;
    allergie?: boolean;
    noteAllergie?: string;
}
export class Prodotto implements IProdotto{
    id: number;
    nome: string;
    prezzo: number;
    priorita: number;    
    opzioni: Opzioni[];
    isMenu : boolean;
    showOpzioni: boolean;
    constructor(){
        this.opzioni = [];
    }
}
export class Opzioni implements IOpzioni{
    id: number;
    nomeOpzione: string;
    opzioneSelezionata?: string;
    priorita:number;
    prezzo: number;
    quantita?:number;
}