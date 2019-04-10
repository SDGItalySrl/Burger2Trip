import { Component } from '@angular/core';
import { OrdineService, Ordine, Prodotto, Opzioni } from '../shared/ordini.service';


@Component({
    selector: 'orders-container',
    templateUrl: './ordini.component.html',
    styles:[ `
        p{margin:0;}
        h6{color:black;}
    `]
})

export class OrdineComponent{ 
    ordineList: Ordine;
    prezzoTotale: number = 0;

    constructor(private ordineService: OrdineService){
        this.ordineList = new Ordine();
     }

    ngOnInit(){
        this.ordineService.ordineListAggiornato.subscribe(
            prodotto => {
                this.ordineList.prodotti = prodotto;
            }
        );

        this.ordineService.prezzoTotaleAggiornato.subscribe(
            prezzo => {
                this.prezzoTotale = prezzo;
            }
        );
    }
    /**
     * Elimina il prodotto dall'ordine
     * @param id id del prodotto
     */
    eliminaProdotto(id: number){
        try{
            this.ordineService.eliminaProdotto(id);
            console.log(this.prezzoTotale)
            console.log(this.ordineList)
        }
        catch(error){
            console.log(error);
        }
    }
    /**
     * Elimina l'opzione del prodotto selezionato dall'ordine
     * @param idProdotto id del prodotto
     * @param idOpzione id dell'opzione
     */
    eliminaOpzione(idProdotto: number, idOpzione: number){
        try{
            this.ordineService.eliminaOpzioniProdotto(idProdotto, idOpzione);
            console.log(this.prezzoTotale)
            console.log(this.ordineList)
        }
        catch(error){
            console.log(error);
        }
    }
    /**
     * Visualizzare/Nascondere le opzioni del prodotto 
     * @param id ID del prodotto
     */
    showHideOpzioni(id:number){
        try{
            (this.ordineList.prodotti[id].showOpzioni == true) ? 
                this.ordineList.prodotti[id].showOpzioni = false : this.ordineList.prodotti[id].showOpzioni = true;
        }
        catch(error){
            console.log(error);
        }
        
    }
    /**
     * Aggiorna la l'oggetto ordineList
     */
    updateordine(ordine: Ordine){
        this.ordineList = ordine;
    }

    
}