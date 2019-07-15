import { Injectable } from '@angular/core';
import { IOrdine, IProdotto, IOpzioni, IdProdottoPadre } from './ordine.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class OrdineService{
    ordine: Ordine;
    prodottoPadre: ProdottoPadre;
    private ordineListProdotti;
    ordineListAggiornato; 
    private prezzoTotale;
    prezzoTotaleAggiornato;
    private consegnaDomicilio;
    flagConsegnaAggiornato;
    private asporto;
    flagAsporto;


    constructor(private http: HttpClient){
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
                if(!this.productExists(prodotto)){
                    prodotto.id = nextId;
                    this.ordine.prodotti.push(prodotto);
                }
            }
            //Riordino la'oggetto prodotti in base alla priorita del prodotto come richiesto
            this.ordine.prodotti.sort(function(a, b) { return a.priorita - b.priorita })
            
            //AGGIORNO LA LISTA ORDINE UTILIZZATA DALL'ORDINE COMPONENT
            this.ordineListProdotti.next(this.ordine.prodotti);
            this.calcoloPrezzoTotale();

            res = true;
        } 
        catch (error) {
            console.log(error.message);
            res = false;
        }
        return res;
    }

/**
     * Eliminazione di un prodotto menu insieme alle sui prodotto (opzioni segnati con nome " nome - Menu")
     * attraverso l'id prodotto padre che è segnato nell'attributo idPrdottoPadre[] 
     * @param idProdotto id prodotto
     */
    eliminaProdottoMenu(idProdotto: number){
        try {
            //Ricavo l'indice dell'opzione e prodotto attraverso i loro id
            var indiceProdotto = this.ordine.prodotti.map(function(prodotto) {return prodotto.id;}).indexOf(idProdotto);
            
            for (let i = 0; i < this.ordine.prodotti.length; i++) {
                if(this.ordine.prodotti[i].idProdottoPadre.length != 0){
                    //Trovo l'indice del idprodottoPadre nell'array
                    var indiceIdProdottoPadre = this.ordine.prodotti[i].idProdottoPadre
                        .map(function(idPrdottoPadre) {return idPrdottoPadre.id})
                        .indexOf(idProdotto);

                    if(indiceIdProdottoPadre != -1){
                        //elimino l'id dall'array
                        this.ordine.prodotti[i].idProdottoPadre.splice(indiceIdProdottoPadre, 1)

                        /*Aggiorno la quantita; Il prezzo non va toccato perchè essendo prodotti figli di un prodotto
                        menu il prezzo è compreso nel prezzo del prodotto padre*/
                        if(this.ordine.prodotti[i].quantita > 1){
                            this.ordine.prodotti[i].quantita -= 1;

                            //se la quantita è 1 la setto a undefined. altrimenti si vedrebbe 1x della quantità 
                            //che deve essere visibile solamente con quantita 1+
                            if(this.ordine.prodotti[i].quantita == 1)
                                this.ordine.prodotti[i].quantita = undefined;
                        }
                        else if(this.ordine.prodotti[i].quantita == undefined){
                            this.ordine.prodotti.splice(i, 1);
                            // se il puntatore di trova sul penultimo record, dopo l'eliminazione cambia il length 
                            // dell'array e salta l'ultimo perchè per lui questo diventa ultimo recordo. Per questo 
                            // motivo faccio -1 per non fargli saltare nessun caso
                            i -= 1;
                        }
                    }
                }
            }
           
            // Tolgo il prodotto padre e aggiorno la lista dei prodotti per la ordini.component
            this.ordine.prodotti.splice(indiceProdotto, 1);
            this.ordineListProdotti.next(this.ordine.prodotti);
            this.calcoloPrezzoTotale();  // ricalcola il prezzoTotale
        } 
        catch (error) {
            console.log(error)
        }
    }

    /**
     * Elimina il prodotto selezionato dall'array ordine
     * @param prodotto id prodotto
     */
    eliminaProdotto(id: number){
        try {
            //Ricavo l'indice del prodotto attraverso l'idProdotto
            let indiceProdotto = this.ordine.prodotti.map(function(prodotto) {return prodotto.id;}).indexOf(id)
            if(this.ordine.prodotti[indiceProdotto].quantita != undefined){
                if(this.ordine.prodotti[indiceProdotto].quantita > 1){
                    this.ordine.prodotti[indiceProdotto].quantita -= 1;
                    this.ordine.prodotti[indiceProdotto].prezzo -= this.ordine.prodotti[indiceProdotto].prezzoBase;

                    //se la quantota del prodotto è 1 la metto a undefined. Se è uno verra visualizzata nella lista
                    if(this.ordine.prodotti[indiceProdotto].quantita == 1)
                        this.ordine.prodotti[indiceProdotto].quantita = undefined;
                }
                else
                    this.ordine.prodotti.splice(indiceProdotto, 1);
            }
            else
                this.ordine.prodotti.splice(indiceProdotto, 1);

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
            if(this.ordine.prodotti[indiceProdotto].opzioni[indiceOpzione].opzioneSelezionata == "Doppio Hamburger")
                this.ordine.prodotti[indiceProdotto].prezzo -= this.ordine.prodotti[indiceProdotto].opzioni[indiceOpzione].prezzo;

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
     * @param p_prodotto Nome del produtto da cercare
     */
    productExists(p_prodotto: Prodotto){
        var res = false;
        try {
            for (let i = 0; i < this.ordine.prodotti.length; i++) {
                this.prodottoPadre = new ProdottoPadre();

                if(this.ordine.prodotti[i].tipo == "bevanda" || this.ordine.prodotti[i].tipo == "fritto" 
                    || this.ordine.prodotti[i].tipo == "OPMenu"){
                    if(this.ordine.prodotti[i].nome === p_prodotto.nome){    

                        /*il produtto esisteva gia e la quantita era undefined quindi aumento a uno*/
                        /*inizialmento è segnata a undefined perchè il numero della quantita viene visualizzata dall'utente*/
                        /*la faccio visualizzare solamente se e più di uno*/
                        if(this.ordine.prodotti[i].quantita == undefined)
                            this.ordine.prodotti[i].quantita = 1

                        /*altrimento aggiungo + 1*/
                        this.ordine.prodotti[i].quantita = this.ordine.prodotti[i].quantita + 1;

                        /*controllo se l'ordine inserito è il figlio di un prodotto e segno il suo id */
                        /*Solo se è di tipo menu */
                        if(this.ordine.prodotti[i].tipo == "OPMenu"){
                            if(this.ordine.prodotti[i].nome.indexOf("Patatine - Menu") != -1){
                                this.prodottoPadre.id = p_prodotto.idProdottoPadre[0].id;
                                this.ordine.prodotti[i].idProdottoPadre.push(this.prodottoPadre);
                            }
                            else {
                                if(this.ordine.prodotti[i].nome.indexOf("- Menu") != -1){
                                    this.prodottoPadre.id = p_prodotto.idProdottoPadre[0].id;
                                    this.ordine.prodotti[i].idProdottoPadre.push(this.prodottoPadre);
                                }
                            }
                        }

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
    calcoloPrezzoTotale(from?){
        try {
            this.ordine.totale = 0;
            for (let index = 0; index < this.ordine.prodotti.length; index++) {
                this.ordine.totale += this.ordine.prodotti[index].prezzo;
            }
            //Aggiungo il costo di consegna al prezzo totale se il flag consegna domicilio è checkato

            if(this.ordine.consegnaDomicilio == true)
                (this.ordine.totale > 20) ? this.ordine.prezzoConsegna = 1 : this.ordine.prezzoConsegna = 3;
            
            if(from == "calcoloFinale" && this.ordine.prezzoConsegna != undefined)
                this.ordine.totale += this.ordine.prezzoConsegna;

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
            this.calcoloPrezzoTotale("calcoloFinale");
        }
        catch (error) {
            console.log(error)
        }
    }

    reimpostaOrdine(){
        this.ordine = new Ordine();
        this.ordineListProdotti = new BehaviorSubject(this.ordine.prodotti);
        this.ordineListAggiornato = this.ordineListProdotti.asObservable();
        this.prezzoTotale = new BehaviorSubject<number>(this.ordine.totale);
        this.prezzoTotaleAggiornato = this.prezzoTotale.asObservable();
        this.consegnaDomicilio = new BehaviorSubject<boolean>(this.ordine.consegnaDomicilio);
        this.flagConsegnaAggiornato = this.consegnaDomicilio.asObservable();
        this.asporto = new BehaviorSubject<boolean>(this.ordine.asporto);
        this.flagAsporto = this.asporto.asObservable();
        
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
    prezzoConsegna: number;
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
    idProdottoPadre: ProdottoPadre[];
    quantita?: number;
    tipo?: string;
    constructor(){
        this.opzioni = [];
        this.idProdottoPadre = [];
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
export class ProdottoPadre implements IdProdottoPadre{
    id: number;
} 