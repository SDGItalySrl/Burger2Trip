import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { IBevande } from '../shared/bevande.model'


@Injectable()
export class BevandeService{
    getBevande(){
        let subject = new Subject();
        setTimeout(() => {
            subject.next(BEVANDE);
            subject.complete();
        }, 100);
        return subject;
    }

    getBevanda(id: number){
        return BEVANDE.find(bevande => bevande.id == id)
    }
}

const BEVANDE : IBevande[] = [
    {
        id: 1,
        nome: "Coca Cola",
        prezzo: 2,
        tipologia: "B"
    },
    {
        id: 2,
        nome: "Fanta",
        prezzo: 2,
        tipologia: "B"
    },
    {
        id: 3,
        nome: "Sprite",
        prezzo: 2,
        tipologia: "B"
    },
    {
        id: 4,
        nome: "Coca Cola Zero",
        prezzo: 2,
        tipologia: "B"
    },
    {
        id: 5,
        nome: "Coca Cola",
        prezzo: 2,
        tipologia: "B"
    },
    {
        id: 6,
        nome: "Lipton Ice Tea al Limone",
        prezzo: 2,
        tipologia: "B"
    },
    {
        id: 7,
        nome: "Lipton Ice Tea alla Pesca",
        prezzo: 2,
        tipologia: "B"
    },
    {
        id: 8,
        nome: "Moretti",
        prezzo: 3,
        tipologia: "BA"
    },
    {
        id: 9,
        nome: "Bud",
        prezzo: 3,
        tipologia: "BA"
    },
    {
        id: 10,
        nome: "Ichnusa non Filtrata",
        prezzo: 3,
        tipologia: "BA"
    },
    {
        id: 11,
        nome: "Birra Artigianale",
        prezzo: 6,
        tipologia: "BA"
    }
    
]