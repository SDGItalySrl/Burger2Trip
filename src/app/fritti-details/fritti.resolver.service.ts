import { Injectable } from '@angular/core';
import { FrittiService } from '../shared/fritti.service';
import { map } from 'rxjs/operators';
import { Resolve } from '@angular/router';

@Injectable()
export class FrittiResolver implements Resolve<any> {
    constructor(private frittiService: FrittiService){ }

    resolve(){
        return this.frittiService.getFritti().pipe(map(fritti => fritti));
    }   
}