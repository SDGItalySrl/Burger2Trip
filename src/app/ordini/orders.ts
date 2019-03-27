import {OrderItems} from './orders-items'

export class Orders{
    prodotto: OrderItems = [];
    totale: number;
    nome: string;
    citta: string;
    cap: number;
    indirizzo: string;
    citofono: string;
    internoScala: string;
    numeroTelefono: number;
    data: Date;
    orario: string;
    note: string;
    allergie: boolean;
    noteAllergie: string;
    consegnaDomicilio: boolean;
}