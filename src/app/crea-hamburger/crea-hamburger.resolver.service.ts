import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CreaHamburgerService } from '../shared/crea-hamburger.service';
import { map } from 'rxjs/operators';


@Injectable()
export class CreaHamburgerResolver{
    constructor(private creaHamburgerService : CreaHamburgerService){ }

    resolve(){
        return this.creaHamburgerService.getOpzioni().pipe(map(opzioniSelezionate => opzioniSelezionate));
    }
}