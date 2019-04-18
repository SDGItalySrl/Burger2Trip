import { Injectable } from "@angular/core";
import { IBevande } from '../shared/bevande.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class BevandeService{
    private url="http://192.168.1.100:8083/spreadsheets?spreadSheetID=16RWD1WCxG904rGeP04DArBHqfovlN102GY65aZhLJcU&range=A%3AD&searchFilter&api-version=1.0";
    
    constructor(private http: HttpClient){ }
    
    getBevande(): Observable<Bevande>{
        console.log('getting bevande from http request');
        return <Observable<Bevande>> this.http.get(this.url)
    }

}

export interface Bevande{
    rows: Array<IBevande>;
}