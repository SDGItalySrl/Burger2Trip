import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { BevandeService } from '../shared/bevande.service';
import { map } from 'rxjs/operators';

@Injectable()
export class BevandeResolver implements Resolve<any> {
    constructor(private bevandeService: BevandeService){ }

    resolve(){
        return this.bevandeService.getBevande().pipe(map(bevande => bevande));
    }
}