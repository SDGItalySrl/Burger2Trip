import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IOpzioni } from './ordine.model';

@Injectable()
export class CreaHamburgerService{
    
    private url="http://192.168.1.100:8083/spreadsheets?spreadSheetID=1Js-J50XB1nRbniEaVQQ5fudAfBKROj9CAdia4kXkA1s&range=A%3AE&searchFilter&api-version=1.0";
    constructor(private http: HttpClient){ } 
    
    getOpzioni(): Observable<Ingredienti>{
        console.log('getting CreaHamburger from http request');
        return <Observable<Ingredienti>> this.http.get(this.url);
    }
}



export interface Ingredienti{
    rows: Array<IOpzioni>;
}