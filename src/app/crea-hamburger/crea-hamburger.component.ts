import { Component, Input } from '@angular/core';
import { Opzioni, OrdineService, Prodotto } from '../shared/ordini.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '../common/toastr.service';
import { CreaHamburgerService } from '../shared/crea-hamburger.service';

@Component({
    selector: 'crea-hamburger',
    templateUrl: './crea-hamburger.component.html'
})

export class CreaHamburgerComponent{
    @Input() required: Boolean;
    tipoHamburger: string;
    listaOpzioniSelezionate: any[];
    tipi: string[] = ['Hamburger Vegetariano', 'Pane e Carne', 'Pane e Cotoletta di pollo'];
    prezzoTotale: number = 0;    
    prodotto: Prodotto = {
        id: undefined,
        nome: undefined,
        prezzo: this.prezzoTotale,
        priorita: 1,
        isMenu: false,
        opzioni: []        
    }     
    ingredienti: Opzioni;

    constructor(private route: ActivatedRoute,
        private toastr: ToastrService,
        private ordine: OrdineService,
        private creaHamburgerService : CreaHamburgerService){ }

    ngOnInit(){
        this.listaOpzioniSelezionate = this.route.snapshot.data['ingredienti'];
    }

    /**
     * Inserisce l'ingrediente nell'oggetto prodotto
     * @param ObjIngrediente 
     */
    aggiungiProdotto(objIngrediente){
        try {
            //lista ingredienti nella quale vengono salvate le opzioni
            let ingrediente = this.prodotto.opzioni.find(opzione => opzione.id == objIngrediente.id); 
            //L'indice dell'ingrediente nella lista originale
            let indexIngrediente = this.creaHamburgerService.getIndex(objIngrediente.id);
    
            if(ingrediente == undefined || ingrediente == null){
                this.prodotto.opzioni.push({
                    id: objIngrediente.id,
                    nomeOpzione: objIngrediente.nome,
                    opzioneSelezionata: undefined,
                    priorita: 1,
                    prezzo: objIngrediente.prezzo,
                    quantita: objIngrediente.quantita + 1
                });            
                //Aggiorno anche la lista che viene utilizzata per mostrare i dati sulla page
                this.listaOpzioniSelezionate[indexIngrediente].quantita =  objIngrediente.quantita + 1;
                this.listaOpzioniSelezionate[indexIngrediente].prezzo = objIngrediente.prezzo;
            }
            else{
                //cerco l'ingrediente con l'ID e aggiorno solamente i campi prezzo e quantita dell'array con l'indice trovato.
                let index = this.prodotto.opzioni.map(function(item) {return item.id;}).indexOf(objIngrediente.id);
                
                this.prodotto.opzioni[index].quantita = this.prodotto.opzioni[index].quantita + 1;
                this.prodotto.opzioni[index].prezzo = this.prodotto.opzioni[index].quantita * listOpzioniPulita[indexIngrediente].prezzo;   
                
                //Aggiorno anche la lista che viene utilizzata per mostrare i dati sulla page
                this.listaOpzioniSelezionate[indexIngrediente].prezzo = this.prodotto.opzioni[index].prezzo;
                this.listaOpzioniSelezionate[indexIngrediente].quantita = this.prodotto.opzioni[index].quantita;
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
            let index = this.prodotto.opzioni.map(function(item) {return item.id;}).indexOf(objIngrediente.id);
            //L'indice dell'ingrediente nella lista originale
            let indexIngrediente = this.creaHamburgerService.getIndex(objIngrediente.id);
    
            this.prodotto.opzioni[index].prezzo = listOpzioniPulita[indexIngrediente].prezzo * (objIngrediente.quantita - 1);
            this.prodotto.opzioni[index].quantita = objIngrediente.quantita - 1;
    
            //Aggiorno anche la lista che viene utilizzata per mostrare i dati sulla page        
            this.listaOpzioniSelezionate[indexIngrediente].quantita = this.prodotto.opzioni[index].quantita;
            this.listaOpzioniSelezionate[indexIngrediente].prezzo = this.prodotto.opzioni[index].prezzo;
        } 
        catch (error) {
            console.log(error);
        }

    }

    /**
     * Calcola il prezzo totale per il prodotto 
     */
    calcolaPrezzoTot(){
        try {
            for (let i = 0; i < this.prodotto.opzioni.length; i++) {
                this.prezzoTotale += this.prodotto.opzioni[i].prezzo;
            }
        } 
        catch (error) {
            console.log(error);
        }
        
    }

    /**
     * Invia l'oggetto prodotto al componente Ordine
     */
    aggiornaOrdine(value){
        this.calcolaPrezzoTot();
        this.prodotto.prezzo = this.prezzoTotale;
        this.prodotto.nome = value.tipoHamburger;
        console.log(this.prodotto);
        // if(this.ordine.inserisciProdotto(this.prodotto))
        //     this.toastr.success("Proddotto aggiunto correttamente");
        // else
        //     this.toastr.error("Qualcosa è andato storto, contattare l'amministratore");
    }
}

// Inizializzo questa costante che si trova nel servizio crea-hamburger.service.ts anche in questo componente perche 
// utilizzanto route.snapshot.data nel ngOnInit dopo che l'array venisse popolato in qualche modo era collegato con 
// listaOpzioniSelezionate e alla modifica di una veniva modificata anche l'altra
const listOpzioniPulita: Array<{id: number, nome: string, quantita: number, prezzo: number}> = [
    {
        id: 1,
        nome: "Bacon",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 2,
        nome: "Cheddar",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 3,
        nome: "Cipolla",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 4,
        nome: "Cipolla Croccante",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 5,
        nome: "Crauti",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 6,
        nome: "Edamer",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 7,
        nome: "Insalata",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 8,
        nome: "Peperoni",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 9,
        nome: "Pomodoro",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 10,
        nome: "Uovo",
        quantita: 0,
        prezzo: 1
    }
];

