import { Injectable } from '@angular/core';
import { IOrdine, IProdotto, IOpzioni } from './ordine.model';
import { OrdineComponent } from '../ordini/ordini.component';



@Injectable()
export class OrdineService{
    ordine: Ordine;   
    constructor(private ordineComponent: OrdineComponent){
        this.ordine = new Ordine();
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
        console.log(this.ordine);       
        this.aggiornaComponenteOrdine();
        return res;
    }

    aggiornaComponenteOrdine(){
        //Aggiorno la lista ordine nel ordineComponent per la visualizzazione dei prodotti nel cart
        this.ordineComponent.updateordine(this.ordine);
    }

    /**
     * Rimuove il prodotto selezionato dalla lista dell'ordine
     */
    rimuoviProdotto(id: number){
        /*TO DO*/
        
    }

    /**
     * Ritorna l'ordine salvato in locale
     */
    getOrdine(): Ordine{
        return this.ordine;
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