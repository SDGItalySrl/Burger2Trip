import { Component } from '@angular/core';
import { OrdineService, Ordine, Prodotto, Opzioni } from '../shared/ordini.service';
import { Router } from '@angular/router';


@Component({
    selector: 'orders-container',
    templateUrl: './ordini.component.html',
    styles:[ `
        p{margin:0;}
        h6{color:black;}
        .order-button{color: black;}
    `]
})

export class OrdineComponent{ 
    ordineList: Ordine;
    prezzoTotale: number = 0;
    prezzoConsegna: number = 0;
    asporto: boolean = false;

    constructor(private ordineService: OrdineService,
                private router: Router){
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

        this.ordineService.flagConsegnaAggiornato.subscribe(
            flag => {
                (flag == true) ? this.prezzoConsegna = 3 : this.prezzoConsegna = 0
            }
        );

        this.ordineService.flagAsporto.subscribe(
            flag => {this.asporto = flag;}
        );
    }
    /**
     * Elimina il prodotto dall'ordine
     * @param id id del prodotto
     */
    eliminaProdotto(id: number){
        try{
            this.ordineService.eliminaProdotto(id);
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
            var indiceOrdine = this.ordineList.prodotti.map(function(ordine) {return ordine.id;}).indexOf(id);
            (this.ordineList.prodotti[indiceOrdine].showOpzioni == true) ? 
                this.ordineList.prodotti[indiceOrdine].showOpzioni = false : this.ordineList.prodotti[indiceOrdine].showOpzioni = true;
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

    /**
     * Controlla il contenuto delle opzioni per far visualizzare il bottone + sul template
     * @param opzioni objOpzioni
     */
    checkOpzioni(prodotto: Prodotto){
        var res = false;
        let contOpzioniSelezionate = 0;
        for (let index = 0; index < prodotto.opzioni.length; index++) {
            if(prodotto.opzioni[index].opzioneSelezionata != "")    
                contOpzioniSelezionate += 1
        }        
        if(contOpzioniSelezionate != 0)
            res = true;
        
        return res;
    }

    /**
        * Reindirizza l'utente al UtenteComponent per completare l'ordine inserendo l'informazione sul cliente
        */
    completaOrdine(){
        this.router.navigate(['/utente']);
    }

}