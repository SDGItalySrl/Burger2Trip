export interface IHamburger{
    id: number;
    nome: string;
    prezzo_singolo: number;
    prezzo_menu: number;
    descrizione: string;
    tipologia: string;
    ingredienti? : string;
    opzioni: IOpzioni[];
}

export interface IOpzioni{
    nomeOpzione: string;
    prezzo?: number;
    priorita?: number;
}