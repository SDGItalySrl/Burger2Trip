import {Injectable} from '@angular/core';
import { IOrdine, IProdotto, IOpzioni } from './ordine.model';

@Injectable()
export class OrdineService{
    ordine: Ordine;
    constructor(){
        this.ordine = new Ordine();
    }
    
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
        return res;
    }
}

export class Ordine implements IOrdine {
    prodotti: Prodotto[];
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
    prezzo?: number;
    quantita?:number;
}