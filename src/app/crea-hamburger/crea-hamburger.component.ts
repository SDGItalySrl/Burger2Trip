import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IOpzioni } from '../shared/hamburger.model';
import { Opzioni, OrdineService, Prodotto } from '../shared/ordini.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '../common/toastr.service';
import { CreaHamburgerService } from '../shared/crea-hamburger.service';

@Component({
    selector: 'crea-hamburger',
    templateUrl: './crea-hamburger.component.html'
})

export class CreaHamburgerComponent{
    //creaHamburgerForm: FormGroup;
    tipoHamburger: string;
    listaOpzioniSelezionate: any[];   
    listOpzioniPulita: any[]; 
    tipi: string[] = ['Hamburger Vegetariano', 'Pane e Carne', 'Pane e Cotoletta di pollo'];
    prezzoTotale: number;    
    prodotto: Prodotto = {
        id: undefined,
        nome: this.tipoHamburger,
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
        this.listOpzioniPulita = this.route.snapshot.data['ingredientiPuliti'];
    }

    aggiungiProdotto(objIngrediente){
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
            this.prodotto.opzioni[index].prezzo = this.prodotto.opzioni[index].quantita * this.listOpzioniPulita[indexIngrediente].prezzo;   
            
            //Aggiorno anche la lista che viene utilizzata per mostrare i dati sulla page
            this.listaOpzioniSelezionate[indexIngrediente].prezzo = this.prodotto.opzioni[index].prezzo;
            this.listaOpzioniSelezionate[indexIngrediente].quantita = this.prodotto.opzioni[index].quantita;
        }
        console.clear();
        console.log(this.prodotto.opzioni);
        console.log( this.listaOpzioniSelezionate[indexIngrediente]);
    }

    rimuoviProdotto(objIngrediente){
        let index = this.prodotto.opzioni.map(function(item) {return item.id;}).indexOf(objIngrediente.id);
        //L'indice dell'ingrediente nella lista originale
        let indexIngrediente = this.creaHamburgerService.getIndex(objIngrediente.id);

        this.prodotto.opzioni[index].prezzo = this.listOpzioniPulita[indexIngrediente].prezzo * (objIngrediente.quantita - 1);
        this.prodotto.opzioni[index].quantita = objIngrediente.quantita - 1;

        //Aggiorno anche la lista che viene utilizzata per mostrare i dati sulla page        
        this.listaOpzioniSelezionate[indexIngrediente].quantita = this.prodotto.opzioni[index].quantita;
        this.listaOpzioniSelezionate[indexIngrediente].prezzo = this.prodotto.opzioni[index].prezzo;

        console.clear();
        console.log(this.prodotto.opzioni);
        console.log(this.listaOpzioniSelezionate[indexIngrediente]);
    }

    calcolaPrezzoTot(){
       
    }

    aggiornaOrdine(){

    }
}

