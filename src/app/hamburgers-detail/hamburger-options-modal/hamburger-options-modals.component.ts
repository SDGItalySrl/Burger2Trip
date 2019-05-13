import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IHamburger } from 'src/app/shared/hamburger.model';
import { OrdineService, Prodotto } from 'src/app/shared/ordini.service';
import { ToastrService } from '../../common/toastr.service';
import { HamburgerService } from 'src/app/shared/hamburger.service';
import { IOpzioni } from 'src/app/shared/ordine.model';
import { CreaHamburgerService, Ingredienti } from 'src/app/shared/crea-hamburger.service';

@Component({
    selector:'hamburger-modal',
    templateUrl:'./hamburger-options-modal.component.html',
    styles: [`
        .hamburger-ingrdienti{ 
            font:500 20px/32px Roboto,"Helvetica Neue",sans-serif;
        }
    `]
})

export class HamburgerOptionsModalComponent{
    opzioniForm: FormGroup;
    public titoloDialog: any;
    public hamburger: IHamburger;
    tipoCottura: FormControl;
    opzione: FormControl;
    bibita: FormControl;
    prodotto: Prodotto;
    listaOpzioniSelezionate: Array<IOpzioni>;
    prezzoTotOpzioni: number = 0;

    
    constructor(private ordine: OrdineService,
                private toastr: ToastrService,
                private hamburgerService: HamburgerService,
                private creaHamburgerService: CreaHamburgerService,
                public dialogRef: MatDialogRef<HamburgerOptionsModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any){  }

    ngOnInit(){
        //la variabile hamburger contiene l'oggetto proveniente dal componente padre hamburger.component.ts
        this.hamburger = this.data.objHamburger;
        this.titoloDialog = this.hamburger.nome; 
        
        this.tipoCottura = new FormControl('');
        this.opzione = new FormControl('');
        if(this.data.isMenu)
            this.bibita = new FormControl('', Validators.required);
        else
            this.bibita = new FormControl({value: '', disabled: true})


        this.opzioniForm = new FormGroup({
            tipoCottura: this.tipoCottura,
            opzione: this.opzione,
            bibita: this.bibita
        })

        this.creaHamburgerService.getOpzioni().subscribe(
            (data: Ingredienti) => { this.listaOpzioniSelezionate = data.rows;},
            (err: any) => console.log(err)
        );

        if(this.prodotto == undefined){
            this.prodotto = new Prodotto();

            this.prodotto.id = undefined;
            this.prodotto.nome= this.hamburger.nome;
            this.prodotto.prezzoBase = undefined;
            this.prodotto.prezzo = undefined;
            this.prodotto.tipo = "hamburger";
            this.prodotto.priorita = 1;
            this.prodotto.isMenu = this.data.isMenu;
            this.prodotto.showOpzioni = false;
            this.prodotto.opzioni = [];            
        }

    }

    /** 
     * Converto i numeri da stringe a int.
     * Utilizzo .toString() perchè il tipo dei dati è number quindi non mi faceva parsare.
    */
    convertiDati(){
        this.hamburger.id = parseInt(this.hamburger.id.toString());
        this.hamburger.prezzo_menu = parseFloat(this.hamburger.prezzo_menu.toString());
        this.hamburger.prezzo_singolo = parseFloat(this.hamburger.prezzo_singolo.toString());
    }

    /**
     * Compone l'oggetto prodotto sul submit del from e salva il prodotto
     */
    salvaProdotto(formValues){
            try {
                if(this.opzioniForm.valid){
                    //converto i numeri da stringe a int
                    this.convertiDati();

                    this.prodotto.opzioni.push({
                        id: 1,
                        nomeOpzione: "Tipo Cottura",
                        opzioneSelezionata : this.tipoCottura.value,
                        priorita: 2,
                        prezzo: undefined
                    },
                    {
                        id: 2,
                        nomeOpzione: "Opzione",
                        opzioneSelezionata: this.opzione.value,
                        priorita: 1,
                        prezzo: (this.opzione.value == "Doppio Hamburger") ? 2.50 : 0,
                    });

                    if(this.data.isMenu){
                        this.aggiungiPatatineMenu();
                        this.aggiungiBibitaMenu(this.bibita.value);
                    }

                    //calcolo il prezzo totale in base al tipo di hamburger selezionato (doppio hamburger o singolo)
                    this.prezzoTotOpzioni = this.hamburgerService.calcoloPrezzoHamburger(this.prodotto);
                    this.prodotto.prezzoBase = (this.data.isMenu == true) ? this.hamburger.prezzo_menu : this.hamburger.prezzo_singolo;
                    this.prodotto.prezzo = this.prezzoTotOpzioni + ((this.data.isMenu == true) ? this.hamburger.prezzo_menu : this.hamburger.prezzo_singolo);
                    
                    if(this.ordine.inserisciProdotto(this.prodotto)){ //inserisco il prodotto chiamando il servizio ordine
                        this.toastr.success("Proddotto aggiunto correttamente");
                        setTimeout(() => {
                            this.opzioniForm.reset();
                            this.reimpostaOggetti();
                        }, 200);
                    }
                    else
                        this.toastr.error("Qualcosa è andato storto, contattare l'amministratore");

                    this.dialogRef.close();
                }
            }
        catch (error) {
            console.log(error);
        }
            
    }   

    aggiungiPatatineMenu(){
        try {
            let prodotto:Prodotto = {
                id: undefined,
                nome: 'Patatine - Menu',
                prezzoBase: 0,
                prezzo: 0,
                priorita: 2,
                isMenu: false,
                showOpzioni: false,
                opzioni: undefined,
                quantita: undefined,
                tipo: "OPMenu"//opzione menu 
            }
            let res: boolean = this.ordine.inserisciProdotto(prodotto);
        } 
        catch (error) {
            console.log(error)    
        }
    }

    aggiungiBibitaMenu(nomeBibita: string){
        try {
            let prodotto:Prodotto = {
                id: undefined,
                nome: nomeBibita + ' - Menu',
                prezzoBase: 0,
                prezzo: 0,
                priorita: 3,
                isMenu: false,
                showOpzioni: false,
                opzioni: undefined,
                quantita: undefined,
                tipo: "OPMenu" //opzione menu
            }
            let res: boolean = this.ordine.inserisciProdotto(prodotto);
        } 
        catch (error) {
            console.log(error)    
        } 
    }

        /**
     * Inserisce l'ingrediente nell'oggetto prodotto
     * @param ObjIngrediente 
     */
    aggiungiOpzione(objIngrediente){
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
                
                //SE IL VALORE E' NEGATIVO ALLORA DIMINUISCO LA QUANTITA' ALTRIMENTI LA AUMENTO
                if(this.prodotto.opzioni[index].valueQuantita=="N" && this.prodotto.opzioni[index].quantita != 0)
                    this.removeOptionQuantity(index, indexIngrediente, objIngrediente);
                else
                    this.addOptionQuantity(index, indexIngrediente, objIngrediente);
                
                if(this.prodotto.opzioni[index].quantita == 0)
                    this.emptyOptionValues(index, indexIngrediente);
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
    rimuoviOpzione(objIngrediente){
        try {
            //lista ingredienti nella quale vengono salvate le opzioni
            let ingrediente = this.prodotto.opzioni.find(opzione => opzione.id == parseInt(objIngrediente.id)); 
            //L'indice dell'ingrediente nella lista originale
            let indexIngrediente = this.getIndex(parseFloat(objIngrediente.id));

            if(ingrediente == undefined || ingrediente == null)
            {
                this.prodotto.opzioni.push({
                    id: parseFloat(objIngrediente.id),
                    nomeOpzione: objIngrediente.nomeOpzione,
                    opzioneSelezionata: objIngrediente.nomeOpzione,
                    priorita: 1,
                    prezzo: parseFloat(objIngrediente.prezzo),
                    quantita: parseFloat(objIngrediente.quantita) + 1,
                    tipo: 'ingrediente-extra',
                    valueQuantita: "N"
                });   
                //Aggiorno anche la lista che viene utilizzata per mostrare i dati sulla page
                this.listaOpzioniSelezionate[indexIngrediente].quantita = parseFloat(objIngrediente.quantita) + 1;
                this.listaOpzioniSelezionate[indexIngrediente].prezzo = parseFloat(objIngrediente.prezzo);
            }
            else
            {
                let index = this.prodotto.opzioni.map(function(item) {return item.id;}).indexOf(parseFloat(objIngrediente.id));

                if(this.prodotto.opzioni[index].valueQuantita =="P" && this.prodotto.opzioni[index].quantita != 0)
                    this.removeOptionQuantity(index, indexIngrediente, objIngrediente);
                else
                   this.addOptionQuantity(index, indexIngrediente, objIngrediente);

                if(this.prodotto.opzioni[index].quantita == 0)
                   this.emptyOptionValues(index, indexIngrediente);
            }            
        } 
        catch (error) {
            console.log(error);
        }

    }

    /**
     * Dopo l'inserimento del prodotto all'ordine reimposta l'oggetto 
     * prodotto e listaOpzioniSelezionate con le imformazioni di default
     */
    reimpostaOggetti(){
        try {
            this.prodotto = new Prodotto();
            this.prodotto.id = undefined;
            this.prodotto.nome= this.hamburger.nome;
            this.prodotto.prezzoBase = undefined;
            this.prodotto.prezzo = undefined;
            this.prodotto.tipo = "hamburger";
            this.prodotto.priorita = 1;
            this.prodotto.isMenu = this.data.isMenu;
            this.prodotto.showOpzioni = false;
            this.prodotto.opzioni = [];  

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
    /**
     * Chiude il dialog dettagli hamburger
     */
    chiudi(){
        this.dialogRef.close();
    } 
    /**
     * Aggiorno la quantita e il prezzo delle opzioni del prodotto nei oggetti
     * @param index indice opzione prodotto
     * @param indexIngrediente indice listaOpzioneSelezionata
     * @param objIngrediente oggetto ingrediente
     */
    addOptionQuantity(index: number, indexIngrediente: number, objIngrediente: any){
        this.prodotto.opzioni[index].quantita = this.prodotto.opzioni[index].quantita + 1;
        this.prodotto.opzioni[index].prezzo = this.prodotto.opzioni[index].quantita * listOpzioniPulita[indexIngrediente].prezzo;
        //Aggiorno anche la lista che viene utilizzata per mostrare i dati sulla page
        this.listaOpzioniSelezionate[indexIngrediente].prezzo = this.prodotto.opzioni[index].prezzo;
        this.listaOpzioniSelezionate[indexIngrediente].quantita = this.prodotto.opzioni[index].quantita;
    }

    /**
     * Aggiorno la quantita e il prezzo delle opzioni del prodotto nei oggetti
     * @param index indice opzione prodotto
     * @param indexIngrediente indice listaOpzioneSelezionata
     * @param objIngrediente oggetto ingrediente
     */
    removeOptionQuantity(index: number, indexIngrediente: number, objIngrediente: any){
        this.prodotto.opzioni[index].prezzo = listOpzioniPulita[indexIngrediente].prezzo * (parseFloat(objIngrediente.quantita) - 1);
        this.prodotto.opzioni[index].quantita = parseFloat(objIngrediente.quantita) - 1;
        //Aggiorno anche la lista che viene utilizzata per mostrare i dati sulla page        
        this.listaOpzioniSelezionate[indexIngrediente].quantita = this.prodotto.opzioni[index].quantita;
        this.listaOpzioniSelezionate[indexIngrediente].prezzo = this.prodotto.opzioni[index].prezzo;
    }

    /**
     * Setto a 0 la quantita e il prezzo dei oggetti prodotto e listaOpzioniSelezionate 
     * @param index indice opzione prodotto
     * @param indexIngrediente indice listaOpzioneSelezionata
     */
    emptyOptionValues(index: number, indexIngrediente: number){
        this.prodotto.opzioni.splice(index, 1);
        this.listaOpzioniSelezionate[indexIngrediente].quantita = 0;
        this.listaOpzioniSelezionate[indexIngrediente].prezzo = 0;
    }

}

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