import { Injectable } from '@angular/core';
import { IOrdine, IProdotto, IOpzioni } from './ordine.model';
import { BehaviorSubject } from 'rxjs';



@Injectable()
export class OrdineService{
    ordine: Ordine;
    private ordineListProdotti;
    ordineListAggiornato; 
    private prezzoTotale;
    prezzoTotaleAggiornato;
    private consegnaDomicilio;
    flagConsegnaAggiornato;
    private asporto;
    flagAsporto;


    constructor(){
        this.ordine = new Ordine();

        this.ordineListProdotti = new BehaviorSubject(this.ordine.prodotti);
        this.ordineListAggiornato = this.ordineListProdotti.asObservable(); //VARIABILE UTILIZZATA DAI COMPONENTI PER INVIARE/RICEVERE DATI
        this.prezzoTotale = new BehaviorSubject<number>(this.ordine.totale);
        this.prezzoTotaleAggiornato = this.prezzoTotale.asObservable(); //VARIABILE UTILIZZATA DAI COMPONENTI PER INVIARE/RICEVERE DATI
        this.consegnaDomicilio = new BehaviorSubject<boolean>(this.ordine.consegnaDomicilio);
        this.flagConsegnaAggiornato = this.consegnaDomicilio.asObservable(); //VARIABILE UTILIZZATA DAI COMPONENTI PER AGGIORNARE DATI VISUALIZZATI
        this.asporto = new BehaviorSubject<boolean>(this.ordine.asporto);
        this.flagAsporto = this.asporto.asObservable(); //VARIABILE UTILIZZATA DAI COMPONENTI PER AGGIORNARE DATI VISUALIZZATI
    }

    /**
     * Inserisce il prodotto nell'oggetto Ordine
     * @param ObjProdotto 
     */
    inserisciProdotto(prodotto: Prodotto){
        let res: boolean = false;
        try {
            const nextId = this.ordine.prodotti.length;
            //Controllo se esiste già il prodotto nella lista per aumentare la quantita
            //Questo controllo vale solamemte per i prodotti fritti e bibite
            if(nextId == 0){
                prodotto.id = nextId;
                this.ordine.prodotti.push(prodotto);
            }
            else{
                if(!this.productExists(prodotto.nome)){
                    prodotto.id = nextId;
                    this.ordine.prodotti.push(prodotto);
                }
            }
            
            //Riordino la'oggetto prodotti in base alla priorita del prodotto come richiesto
            this.ordine.prodotti.sort(function(a, b) { return a.priorita - b.priorita })
            
            //AGGIORNO LA LISTA ORDINE UTILIZZATA DALL'ORDINE COMPONENT
            this.ordineListProdotti.next(this.ordine.prodotti);
            this.calcoloPrezzoTotale();

            console.log(this.ordine.prodotti)
            res = true;
        } 
        catch (error) {
            console.log(error.message);
            res = false;
        }
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
            //Ricavo l'indice dell'opzione e prodotto attraverso i loro id
            var indiceProdotto = this.ordine.prodotti.map(function(prodotto) {return prodotto.id;}).indexOf(idProdotto);
            var indiceOpzione = this.ordine.prodotti[indiceProdotto].opzioni.map(function(opzione) {return opzione.id;}).indexOf(idOpzione);
            
            //Aggiorno il prezzo del prodotto se l'utente elimina l'opzione "Doppio Hamburger"
            //che costa +€2.50 
            if(this.ordine.prodotti[indiceProdotto].opzioni[indiceOpzione].opzioneSelezionata == "Doppio Hamburger"){
                this.ordine.prodotti[indiceProdotto].prezzo = 
                    this.ordine.prodotti[indiceProdotto].prezzo - this.ordine.prodotti[indiceProdotto].opzioni[indiceOpzione].prezzo;
            }
            //Eliminazione dei singoli ingredienti + aggionamento del prezzo per il HamburgerOptionsModalComponent e CreaHamburgerComponent
            if(this.ordine.prodotti[indiceProdotto].tipo == "crea-hamburger" ||
                this.ordine.prodotti[indiceProdotto].opzioni[indiceOpzione].valueQuantita == "P")
                    this.ordine.prodotti[indiceProdotto].prezzo -= this.ordine.prodotti[indiceProdotto].opzioni[indiceOpzione].prezzo;


            this.ordine.prodotti[indiceProdotto].opzioni.splice(indiceOpzione, 1);
            //Aggiorno la lista dei prodotti per la ordini.component
            this.ordineListProdotti.next(this.ordine.prodotti);
            this.calcoloPrezzoTotale();  // ricalcola il prezzoTotale
        } 
        catch (error) {
            console.log(error)
        }
    }

    /**
     * Controllo se esiste già il prodotto nella lista ordine
     * Se si aumento la quantità del prodotto, altrimmenti inserisco il prodotto nell'ordine
     * @param productName Nome del produtto da cercare
     */
    productExists(nomeProdotto: string){
        var res = false;
        try {
            for (let i = 0; i < this.ordine.prodotti.length; i++) {
                if(this.ordine.prodotti[i].tipo == "bevanda" || this.ordine.prodotti[i].tipo == "fritto" || this.ordine.prodotti[i].tipo == "OPMenu"){
                    if(this.ordine.prodotti[i].nome === nomeProdotto){                        
                        if(this.ordine.prodotti[i].quantita == undefined)
                            this.ordine.prodotti[i].quantita = 1
                            
                        this.ordine.prodotti[i].quantita = this.ordine.prodotti[i].quantita + 1;
                        if(this.ordine.prodotti[i].tipo != "OPMenu")
                            this.ordine.prodotti[i].prezzo = this.ordine.prodotti[i].prezzoBase * this.ordine.prodotti[i].quantita;
                        res = true;
                    }
                }
            }
        }
        catch (error) {
            console.log(error.message)    
        }
        return res;
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
            //Aggiungo il costo di consegna al prezzo totale se il flag consegna domicilio è checkato
            if(this.ordine.totale > 20)
                (this.ordine.consegnaDomicilio == true) ? this.ordine.totale += 1 : this.ordine.totale;
            else
                (this.ordine.consegnaDomicilio == true) ? this.ordine.totale += 3 : this.ordine.totale;
            this.prezzoTotale.next(this.ordine.totale);
        } 
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Completa l'ordine inserendo le informazione dell'utente nell'oggetto ordine'
     * @param UserFormValues objUserFormValue
     */
    completaOrdine(userFormValues){
        try {
            this.ordine.nomeCliente = userFormValues.nome;
            this.ordine.numeroTelefono = userFormValues.telefono;
            this.ordine.indirizzo = userFormValues.indirizzo;
            this.ordine.citta = userFormValues.citta;
            this.ordine.citofono = userFormValues.citofono;
            this.ordine.internoScala = userFormValues.internoScala;
            this.ordine.data = userFormValues.data;
            this.ordine.orario = userFormValues.orario;
            this.ordine.note = userFormValues.note;
            this.ordine.consegnaDomicilio = userFormValues.consegnaDomicilio;
            this.ordine.asporto = userFormValues.asporto;

            this.consegnaDomicilio.next(this.ordine.consegnaDomicilio);
            this.asporto.next(this.ordine.asporto);
            this.calcoloPrezzoTotale();
            console.log(this.ordine);
        }
        catch (error) {
            console.log(error)
        }
    }

    reimpostaOrdine(){
        this.ordine = new Ordine();
        this.ordineListProdotti = new BehaviorSubject(this.ordine.prodotti);
        this.ordineListProdotti.next();
        this.prezzoTotale = new BehaviorSubject<number>(this.ordine.totale);
        this.prezzoTotale.next();
        this.consegnaDomicilio = new BehaviorSubject<boolean>(this.ordine.consegnaDomicilio);
        this.consegnaDomicilio.next();
        this.asporto = new BehaviorSubject<boolean>(this.ordine.asporto);
        this.asporto.next();
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
    indirizzo: string;
    citofono: string;
    internoScala?: string;
    numeroTelefono: number;
    data: Date;
    orario: string;
    note?: string;
    allergie?: boolean;
    asporto: boolean;
}
export class Prodotto implements IProdotto{
    id: number;
    nome: string;
    prezzoBase: number;
    prezzo: number;
    priorita: number;    
    opzioni: Opzioni[];
    isMenu : boolean;
    showOpzioni: boolean;
    quantita?: number;
    tipo?: string;
    constructor(){
        this.opzioni = [];
    }
}
export class Opzioni implements IOpzioni{
    id: number;
    nomeOpzione: string;
    opzioneSelezionata?: string;
    priorita?:number;
    prezzo: number;
    quantita?:number;
    tipo? : string;
    valueQuantita?: string; //quantita positiva o negativa. P: positivio. N: Negativo
}