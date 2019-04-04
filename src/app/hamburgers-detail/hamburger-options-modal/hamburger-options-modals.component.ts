import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IHamburger } from 'src/app/shared/hamburger.model';
import { OrdineService, Prodotto } from 'src/app/shared/ordini.service';
import { ToastrService } from '../../common/toastr.service';

@Component({
    selector:'hamburger-modal',
    templateUrl:'./hamburger-options-modal.component.html'
})

export class HamburgerOptionsModalComponent{
    opzioniForm: FormGroup;
    public titoloDialog: any;
    public hamburger: IHamburger;
    private tipoCottura: FormControl;
    private opzione: FormControl;
    private bibita: FormControl;

    constructor(private ordine: OrdineService,
                private toastr: ToastrService,
                public dialogRef: MatDialogRef<HamburgerOptionsModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any){  }

    ngOnInit(){
        //la variabile hamburger contiene l'oggetto proveniente dal componente padre hamburger.component.ts
        this.hamburger = this.data.objHamburger;
        this.titoloDialog = this.hamburger.nome;

        this.tipoCottura = new FormControl('');
        this.opzione = new FormControl('');
        if(this.data.isMenu)
            this.bibita = new FormControl('', Validators.required);
        else
            this.bibita = new FormControl({value: '', disabled: true})


        this.opzioniForm = new FormGroup({
            tipoCottura: this.tipoCottura,
            opzione: this.opzione,
            bibita: this.bibita
        })
    }

    salvaProdotto(){
            try {
                if(this.opzioniForm.valid){
                //Compongo l'oggetto prodotto da inserire all'interno dell'oggetto Ordine 
                let prodotto: Prodotto = {
                    id: this.hamburger.id,
                    nome: this.hamburger.nome,
                    prezzo: (this.data.isMenu == true) ? this.hamburger.prezzo_menu : this.hamburger.prezzo_singolo,
                    priorita: 1,
                    isMenu: this.data.isMenu,
                    opzioni: [
                        {
                            id: 1,
                            nomeOpzione: "Tipo Cottura",
                            opzioneSelezionata : this.tipoCottura.value,
                            priorita: 2
                        },
                        {
                            id: 2,
                            nomeOpzione: "Opzione",
                            opzioneSelezionata: this.opzione.value,
                            priorita: 1,
                            prezzo: (this.opzione.value == "Doppio Hamburger") ? 2.50 : 0
                        },
                        {
                            id: 3,
                            nomeOpzione: "Bibita",
                            opzioneSelezionata: this.bibita.value,
                            priorita: 3
                        }
                    ]
                }
                let res: boolean = this.ordine.inserisciProdotto(prodotto); //inserisco il prodotto chiamando il servizio ordine
                this.dialogRef.close();
                if(res)
                    this.toastr.success("Prodotto aggiunto all'ordine");
            }   
            }
            catch (error) {
                console.log(error);
            }
            
        }     

    chiudi(){
        this.dialogRef.close();
    }
}