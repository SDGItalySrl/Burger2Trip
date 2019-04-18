export interface IOrdine{
    id: number;
    prodotti?: IProdotto[];
    totale: number;
    nomeCliente: string;
    consegnaDomicilio: boolean;
    asporto: boolean;
    citta: string;
    indirizzo: string;
    citofono: string;
    internoScala?: string;
    numeroTelefono: number;
    data: Date;
    orario: string;
    note?: string;
    allergie?: boolean;
}

export interface IProdotto{
    id: number;
    nome: string;
    prezzo: number;
    priorita: number;
    opzioni: IOpzioni[];
    isMenu : Boolean;
    showOpzioni: Boolean;
    quantita?: number;
    tipo?: string;
}


export interface IOpzioni{
    id: number;
    nomeOpzione: string;
    opzioneSelezionata?: string;
    priorita?:number;
    prezzo: number;
    quantita?: number;
}
