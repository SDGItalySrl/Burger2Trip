import { Component } from '@angular/core';
import { OrdineService } from '../shared/ordini.service';


@Component({
    selector: 'orders-container',
    templateUrl: './ordini.component.html'
})
export class OrdineComponent{
    
    constructor(private ordine: OrdineService){

    }

}

