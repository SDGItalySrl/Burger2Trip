import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFritti } from '../shared/fritti.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FrittiService{

    objFritti: Array<IFritti>;
    private url="http://192.168.1.100:8083/spreadsheets?spreadSheetID=1511HMmm2eLKMOfvtsslte-2AQb2iX4FV595GCEnj16Q&range=A%3AE&searchFilter&api-version=1.0";
    constructor(private http: HttpClient){ } 

    getFritti(): Observable<Fritti>{
        console.log('getting fritti from http request');
        return <Observable<Fritti>> this.http.get(this.url);         
    }
}

export interface Fritti{
    rows: Array<IFritti>;
}