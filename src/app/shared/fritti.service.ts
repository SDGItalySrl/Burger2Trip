import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IFritti } from '../shared/fritti.model';

@Injectable()
export class FrittiService{

    getFritti(){
        let subject = new Subject();
        setTimeout(() => {
            subject.next(FRITTI);
            subject.complete();
        }, 100);

        return subject;
    }

    getFritto(id: number){
        return FRITTI.find(fritti => fritti.id == id);
    }
}
const FRITTI : IFritti[] = [
    {
        id: 1,
        nome: "Patatine Picccole",
        prezzo: 1.50,
        tipologia: "f"
    },
    {
        id: 2,
        nome: "Patatine Grandi",
        prezzo: 2.50,
        tipologia: "f"
    },
    {
        id: 3,
        nome: "Nuggets",
        quantita: "5 pezzi",
        prezzo: 3.50,
        tipologia: "f"
    },
    {
        id: 4,
        nome: "Mozzarelline",
        quantita: "5 pezzi",
        prezzo: 2.50,
        tipologia: "f"
    },
    {
        id: 5,
        nome: "Alette di Pollo",
        quantita: "4 pezzi",
        prezzo: 4,
        tipologia: "f"
    },
    {
        id: 6,
        nome: "Onion Rings",
        quantita: "5 pezzi",
        prezzo: 2.50,
        tipologia: "f"
    },
    {
        id: 7,
        nome: "Crispi Habanero",
        quantita: "4 pezzi",
        prezzo: 5,
        tipologia: "f"
    },
    {
        id: 8,
        nome: "Spicy Patatwerk",
        prezzo: 5,
        tipologia: "f"
    },
    {
        id: 9,
        nome: "Bocconcini di Cambembert",
        quantita: "5 pezzi",
        prezzo: 5,
        tipologia: "f"
    }
]