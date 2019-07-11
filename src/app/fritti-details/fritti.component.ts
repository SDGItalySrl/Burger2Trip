import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '../common/toastr.service';
import { Prodotto, OrdineService } from '../shared/ordini.service';
import { FrittiService, Fritti } from '../shared/fritti.service';
import { IFritti } from '../shared/fritti.model';

@Component({
    selector: 'fritti-details',
    templateUrl: './fritti.component.html'
})

export class FrittiDetailComponent{
    fritti: Array<IFritti>;
    
    constructor(private toastr: ToastrService,
                private ordine: OrdineService,
                private frittiService: FrittiService){ }

    ngOnInit(){
        this.frittiService.getFritti().subscribe(
              (data: Fritti) => {this.fritti = data.rows},
              (err: any) => console.log(err)
            );
    }

    aggiungiProdotto(objFritto){
        try {
            let prodotto:Prodotto = {
                id: parseInt(objFritto.id),
                nome: objFritto.nome,
                prezzoBase: parseFloat(objFritto.prezzo),
                prezzo: parseFloat(objFritto.prezzo),
                priorita: 2,
                isMenu: false,
                showOpzioni: false,
                idProdottoPadre: undefined,
                opzioni: undefined,
                quantita: undefined,
                tipo: "fritto"        
            }
            let res: boolean = this.ordine.inserisciProdotto(prodotto);
            if(res)
                this.toastr.success("Prodotto aggiunto all'ordine");
        } 
        catch (error) {
            console.log(error)    
        }
    }
}