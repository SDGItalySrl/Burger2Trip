import { Component, Input } from '@angular/core';
import { Opzioni, OrdineService, Prodotto } from '../shared/ordini.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '../common/toastr.service';
import { CreaHamburgerService, Ingredienti } from '../shared/crea-hamburger.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IOpzioni } from '../shared/ordine.model';
import { HamburgerService } from '../shared/hamburger.service';

@Component({
    selector: 'crea-hamburger',
    templateUrl: './crea-hamburger.component.html'
})

export class CreaHamburgerComponent{
    creaForm: FormGroup
    @Input() required: Boolean;
    tipoHamburger: string;
    listaOpzioniSelezionate: Array<IOpzioni>;
    tipi: string[] = ['Hamburger Vegetariano', 'Pane e Carne', 'Pane e Cotoletta di pollo'];
    prezzoTotOpzioni: number = 0;
    prodotto: Prodotto;
    ingredienti: Opzioni;

    constructor(private route: ActivatedRoute,
        private toastr: ToastrService,
        private ordine: OrdineService,
        private creaHamburgerService : CreaHamburgerService,
        private hamburgerService: HamburgerService){ }

    ngOnInit(){
       // this.listaOpzioniSelezionate = this.route.snapshot.data['ingredienti'];
       this.creaHamburgerService.getOpzioni().subscribe(
            (data: Ingredienti) => { this.listaOpzioniSelezionate = data.rows;},
            (err: any) => console.log(err)
        );

        let tipoHamburger = new FormControl("", Validators.required);
        this.creaForm = new FormGroup({
            tipoHamburger: tipoHamburger
        })

        if(this.prodotto == undefined){
            this.prodotto = new Prodotto();

            this.prodotto.id = undefined;
            this.prodotto.nome= undefined;
            this.prodotto.prezzoBase = undefined;
            this.prodotto.prezzo = 0;
            this.prodotto.tipo = "crea-hamburger";
            this.prodotto.priorita = 1;
            this.prodotto.isMenu = false;
            this.prodotto.showOpzioni = false;
            this.prodotto.opzioni = [];
            
        }
    }
    /**
     * Inserisce l'ingrediente nell'oggetto prodotto
     * @param ObjIngrediente 
     */
    aggiungiProdotto(objIngrediente){
        try {
            //lista ingredienti nella quale vengono salvate le opzioni
            let ingrediente = this.prodotto.opzioni.find(opzione => opzione.id == parseInt(objIngrediente.id)); 
            //L'indice dell'ingrediente nella lista originale
            let indexIngrediente = this.getIndex(parseInt(objIngrediente.id));

            if(ingrediente == undefined || ingrediente == null){
                this.prodotto.opzioni.push({
                    id: parseFloat(objIngrediente.id),
                    nomeOpzione: objIngrediente.nomeOpzione,
                    opzioneSelezionata: objIngrediente.nomeOpzione,
                    priorita: 1,
                    prezzo: parseFloat(objIngrediente.prezzo),
                    quantita: parseFloat(objIngrediente.quantita) + 1,
                    tipo: 'ingrediente-extra',
                    valueQuantita: "P"
                });            
                //Aggiorno anche la lista che viene utilizzata per mostrare i dati sulla page
                this.listaOpzioniSelezionate[indexIngrediente].quantita = parseFloat(objIngrediente.quantita) + 1;
                this.listaOpzioniSelezionate[indexIngrediente].prezzo = parseFloat(objIngrediente.prezzo);
            }
            else{
                //cerco l'ingrediente con l'ID e aggiorno solamente i campi prezzo e quantita dell'array con l'indice trovato.
                let index = this.prodotto.opzioni.map(function(item) {return item.id;}).indexOf(parseFloat(objIngrediente.id));
                
                this.prodotto.opzioni[index].quantita = this.prodotto.opzioni[index].quantita + 1;
                this.prodotto.opzioni[index].prezzo = this.prodotto.opzioni[index].quantita * listOpzioniPulita[indexIngrediente].prezzo;   
                
                //Aggiorno anche la lista che viene utilizzata per mostrare i dati sulla page
                this.listaOpzioniSelezionate[indexIngrediente].prezzo = this.prodotto.opzioni[index].prezzo;
                this.listaOpzioniSelezionate[indexIngrediente].quantita = this.prodotto.opzioni[index].quantita;

                console.log(this.prodotto)
                console.log(this.listaOpzioniSelezionate[indexIngrediente])
            }

        } 
        catch (error) {
            console.log(error);
        }
    }
    /**
     * Rimuove l'ingrediente dall'oggetto prodotto
     * @param ObjIngrediente 
     */
    rimuoviProdotto(objIngrediente){
        try {
            let index = this.prodotto.opzioni.map(function(item) {return item.id;}).indexOf(parseFloat(objIngrediente.id));
            //L'indice dell'ingrediente nella lista originale
            let indexIngrediente = this.getIndex(parseFloat(objIngrediente.id));
    
            this.prodotto.opzioni[index].prezzo = listOpzioniPulita[indexIngrediente].prezzo * (parseFloat(objIngrediente.quantita) - 1);
            this.prodotto.opzioni[index].quantita = parseFloat(objIngrediente.quantita) - 1;
    
            //Aggiorno anche la lista che viene utilizzata per mostrare i dati sulla page        
            this.listaOpzioniSelezionate[indexIngrediente].quantita = this.prodotto.opzioni[index].quantita;
            this.listaOpzioniSelezionate[indexIngrediente].prezzo = this.prodotto.opzioni[index].prezzo;
        } 
        catch (error) {
            console.log(error);
        }

    }
    /**
     * Invia l'oggetto prodotto al componente Ordine
     * @value tipoHamburger
     */
    aggiornaOrdine(value){
        this.prezzoTotOpzioni = this.hamburgerService.calcoloPrezzoTotale(this.prodotto);
        this.prodotto.prezzo = this.prezzoTotOpzioni + prezzoHamburger;
        this.prodotto.prezzoBase = prezzoHamburger;
        this.prodotto.nome = value.tipoHamburger;
        if(this.ordine.inserisciProdotto(this.prodotto)){ //inserisco il prodotto chiamando il servizio ordine
            this.toastr.success("Proddotto aggiunto correttamente");
            setTimeout(() => {
                this.creaForm.reset();
                this.reimpostaOggetti();
            }, 200);
        }
        else
            this.toastr.error("Qualcosa è andato storto, contattare l'amministratore");
    }
    /**
     * Dopo l'inserimento del prodotto all'ordine reimposta l'oggetto 
     * prodotto e listaOpzioniSelezionate con le imformazioni di default
     */
    reimpostaOggetti(){
        try {
            this.prodotto = new Prodotto();
            this.prodotto.id = undefined;
            this.prodotto.nome= undefined;
            this.prodotto.prezzoBase = undefined;
            this.prodotto.prezzo = 0;
            this.prodotto.priorita = 1;
            this.prodotto.isMenu = false;
            this.prodotto.showOpzioni = false;
            this.prodotto.opzioni = [];
            this.prodotto.tipo = "crea-hamburger";

            this.prezzoTotOpzioni = 0; //contatore opzioni presenti nel prodotto

            this.listaOpzioniSelezionate.forEach(element => {
                element.quantita = 0;
                element.prezzo = 1;    
            });
        }
        catch (error) {
    
}
    }
    /**
     * Ritorna la posizione dell'opzione nella lista pulita delle opzioni 
     * @param id idOpzione
     */
    getIndex(id:number){
        return listOpzioniPulita.map(function(ingrediente) {return ingrediente.id;}).indexOf(id);
    }
}

const prezzoHamburger: number = 4.5;
// Inizializzo questa costante che si trova nel servizio crea-hamburger.service.ts anche in questo componente perche 
// utilizzanto route.snapshot.data nel ngOnInit dopo che l'array venisse popolato in qualche modo era collegato con 
// listaOpzioniSelezionate e alla modifica di una veniva modificata anche l'altra
///////////L'ORDINE IN CUI VIENE POPOLATO DEVE ESSERE UGUALE A QUELLO DEL FOGLIO DI GOOGLE///////////
const listOpzioniPulita: Array<IOpzioni> = [
    {
        id: 1,
        nomeOpzione: "Edamer",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 2,
        nomeOpzione: "Cheddar",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 3,
        nomeOpzione: "Bacon",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 4,
        nomeOpzione: "Cipolla",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 5,
        nomeOpzione: "Cipolla Croccante",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 6,
        nomeOpzione: "Crauti",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 7,
        nomeOpzione: "Insalata",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 8,
        nomeOpzione: "Peperoni",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 9,
        nomeOpzione: "Uovo",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 10,
        nomeOpzione: "Pomodoro",
        quantita: 0,
        prezzo: 1
    }
];