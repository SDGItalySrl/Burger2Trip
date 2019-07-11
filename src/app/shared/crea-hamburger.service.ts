import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IOpzioni } from './ordine.model';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class CreaHamburgerService{
    
    constructor(private http: HttpClient){ } 
    
    getOpzioni(): Observable<Ingredienti>{
        return <Observable<Ingredienti>> this.http.get(environment.creaHamburgerSheet);
    }
}



export interface Ingredienti{
    rows: Array<IOpzioni>;
}