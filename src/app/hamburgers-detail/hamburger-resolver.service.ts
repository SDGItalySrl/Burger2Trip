import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HamburgerService } from './hamburger.service';
import { map } from 'rxjs/operators';

@Injectable()
export class HamburgerResolver implements Resolve <any> {
    constructor(private humburgerService: HamburgerService){ }

    resolve(){
        return this.humburgerService.getHumburgers().pipe(map(hamburgers => hamburgers));
    }
}