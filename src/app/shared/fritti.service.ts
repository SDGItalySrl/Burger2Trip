import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFritti } from '../shared/fritti.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class FrittiService{

    objFritti: Array<IFritti>;
    constructor(private http: HttpClient){ } 

    getFritti(): Observable<Fritti>{
        return <Observable<Fritti>> this.http.get(environment.frittiSheet);         
    }
}

export interface Fritti{
    rows: Array<IFritti>;
}