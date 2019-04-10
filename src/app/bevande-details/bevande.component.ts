import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '../common/toastr.service';
import { OrdineService, Prodotto } from '../shared/ordini.service';


@Component({
    selector: 'bevande',
    templateUrl: './bevande.component.html'
})

export class BevandeDetailComponent{
    bevande: any[];

    constructor(private route: ActivatedRoute,
                private toastr: ToastrService,
                private ordine: OrdineService){ }

    ngOnInit(){
        this.bevande = this.route.snapshot.data['bevande'];
    }

    aggiungiProdotto(objBevanda){
        try {
                let prodotto: Prodotto = {
                id: objBevanda.id,
                nome: objBevanda.nome,
                prezzo: objBevanda.prezzo,
                priorita: 3,
                isMenu: false,
                showOpzioni: false,
                opzioni: undefined  
        }
        let res: boolean = this.ordine.inserisciProdotto(prodotto);
        if(res)
            this.toastr.success("Prodotto aggiunto all'ordine");
        } 
        catch (error) {
            console.log(error.message)
        }
    }

}