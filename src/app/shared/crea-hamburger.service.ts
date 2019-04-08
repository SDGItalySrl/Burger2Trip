import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CreaHamburgerService{
    getOpzioni(){
        let subject = new Subject();
        setTimeout(() =>{ subject.next(OPZIONI); subject.complete(); }, 100);
        return subject;
    }

    getOpzione(id: number){
        return OPZIONI.find(opzione => opzione.id == id);
    }

    getIndex(id:number){
        return OPZIONI.map(function(ingrediente) {return ingrediente.id;}).indexOf(id);
    }
}

const OPZIONI: Array<{id: number, nome: string, quantita: number, prezzo: number}> = [
    {
        id: 1,
        nome: "Bacon",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 2,
        nome: "Cheddar",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 3,
        nome: "Cipolla",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 4,
        nome: "Cipolla Croccante",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 5,
        nome: "Crauti",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 6,
        nome: "Edamer",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 7,
        nome: "Insalata",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 8,
        nome: "Peperoni",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 9,
        nome: "Pomodoro",
        quantita: 0,
        prezzo: 1
    },
    {
        id: 10,
        nome: "Uovo",
        quantita: 0,
        prezzo: 1
    }
];