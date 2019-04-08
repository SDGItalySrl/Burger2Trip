import { Component, Injectable } from '@angular/core';
import { OrdineService, Ordine } from '../shared/ordini.service';


@Component({
    selector: 'orders-container',
    templateUrl: './ordini.component.html'
})

@Injectable()
export class OrdineComponent{ 
    ordineList: Ordine;
    constructor(private ordineService: OrdineService){ }

    /**
     * Rimuove il prodotto selezionato dalla lista dell'ordine
     */
    rimuoviProdotto(id: number){
        this.ordineService.rimuoviProdotto(id);
    }

    /**
     * Aggiorna la l'oggetto ordineList
     */
    updateordine(ordine: Ordine){
        this.ordineList = ordine;
    }

}