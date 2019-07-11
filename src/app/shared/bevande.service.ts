import { Injectable } from "@angular/core";
import { IBevande } from '../shared/bevande.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';


@Injectable()
export class BevandeService{
    url: string = "";
    constructor(private http: HttpClient){ }
    
    getBevande(): Observable<Bevande>{
        return <Observable<Bevande>> this.http.get(environment.bevandeSheet);
    }

}

export interface Bevande{
    rows: Array<IBevande>;
}