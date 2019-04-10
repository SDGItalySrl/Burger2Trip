import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '../common/toastr.service';
import { Prodotto, OrdineService } from '../shared/ordini.service';

@Component({
    selector: 'fritti-details',
    templateUrl: './fritti.component.html'
})

export class FrittiDetailComponent{
    fritti : any[];
    constructor(private route: ActivatedRoute,
                private toastr: ToastrService,
                private ordine: OrdineService){ }

    ngOnInit(){
        this.fritti = this.route.snapshot.data['fritti'];
    }

    aggiungiProdotto(objFritto){
        try {
            let prodotto:Prodotto = {
                id: objFritto.id,
                nome: objFritto.nome,
                prezzo: objFritto.prezzo,
                priorita: 2,
                isMenu: false,
                showOpzioni: false,
                opzioni: undefined                
            }
            let res: boolean = this.ordine.inserisciProdotto(prodotto);
            if(res)
                this.toastr.success("Prodotto aggiunto all'ordine");
        } 
        catch (error) {
            
        }
    }
}