import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '../common/toastr.service';
import { OrdineService, Prodotto } from '../shared/ordini.service';
import { BevandeService, Bevande } from '../shared/bevande.service';


@Component({
    selector: 'bevande',
    templateUrl: './bevande.component.html'
})

export class BevandeDetailComponent{
    bevande: any[];

    constructor(private toastr: ToastrService,
                private ordine: OrdineService,
                private bevandeService: BevandeService){ }

    ngOnInit(){
        this.bevandeService.getBevande().subscribe(
            (data: Bevande) => this.bevande = data.rows,
            (err: any) => console.log(err)
        );
    }

    aggiungiProdotto(objBevanda){
        try {
            let prodotto: Prodotto = {
                id: parseInt(objBevanda.id),
                nome: objBevanda.nome,
                prezzo: parseFloat(objBevanda.prezzo),
                priorita: 3,
                isMenu: false,
                showOpzioni: false,
                opzioni: undefined,
                quantita: undefined,
                tipo: "bevanda"
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