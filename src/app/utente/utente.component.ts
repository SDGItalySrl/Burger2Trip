import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrdineService } from '../shared/ordini.service';
import { PrinterService } from '../shared/printer.service'; 
import { ToastrService } from '../common/toastr.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { StampaComanda } from './stampaComanda.component';
import { OrdineComponent } from '../ordini/ordini.component';

declare var qz: any;

@Component({
    selector: "user",
    templateUrl: "./utente.component.html",
    styles: [`
       .order-button[_ngcontent-c6]{display:none;}
    `]
})

export class UtenteComponent{

    printer = {
        host: '172.31.5.200',
        port: '9100'
    }
    formInfoUtente: FormGroup;
    nome: string;
    indirizzo: string;
    citta: string;
    internoScala: string;
    telefono: number;
    citofono: string;
    serializzaData;
    orario: string;
    note: string;
    consegnaDomicilio: boolean;
    asporto: boolean;

    constructor(private ordineService: OrdineService,
                private printerService: PrinterService,
                private toastr: ToastrService,
                public dialog: MatDialog){ }

    ngOnInit(){

        let nome = new FormControl("", Validators.required);
        let telefono = new FormControl("", Validators.required);
        let indirizzo = new FormControl("", Validators.required);
        let citta = new FormControl("");
        let citofono = new FormControl("");
        let internoScala = new FormControl("");
        let data = new FormControl(new Date());
        let orario = new FormControl("", Validators.required);
        let note = new FormControl("");
        let consegnaDomicilio = new FormControl(false);
        let asporto = new FormControl(false);
        this.formInfoUtente = new FormGroup({
            nome: nome,
            telefono: telefono,
            indirizzo: indirizzo,
            citta: citta,
            citofono: citofono,
            internoScala: internoScala,
            data: data,
            orario: orario,
            note: note,
            consegnaDomicilio: consegnaDomicilio,
            asporto: asporto
        });

        //SE IL CHECKBOX CONSEGNADOMICILIO E' CHECCKATO ALLORA TOLGO IL CONTROLLO REQUIRED DAI SEGUENTI CAMPI
        if(this.formInfoUtente.get('consegnaDomicilio').value == false){
            this.formInfoUtente.get('nome').clearValidators();
            this.formInfoUtente.get('telefono').clearValidators();
            this.formInfoUtente.get('indirizzo').clearValidators();
            this.formInfoUtente.get('orario').clearValidators();
        }
        else{
            this.formInfoUtente.get('nome').validator = <any>Validators.compose([Validators.required]);
            this.formInfoUtente.get('telefono').validator = <any>Validators.compose([Validators.required]);
            this.formInfoUtente.get('indirizzo').validator = <any>Validators.compose([Validators.required]);
            this.formInfoUtente.get('orario').validator = <any>Validators.compose([Validators.required]);
        } 
        this.formInfoUtente.get('nome').updateValueAndValidity();
    }

    openDialog(){
        const ordine = this.ordineService.ordine;
        const dialogRef = this.dialog.open(StampaComanda, {
          width: '200px',
          data: ordine
        });
    }

    /**
     * Invia le informazioni dell'utente all'ordini component per completare l'ordine
     * @param formValue objForm
     */
    completaOrdine(formValues){
        try {
            this.ordineService.completaOrdine(formValues);
            if(this.printerService.print(this.ordineService.ordine)){
                this.reimpostaOrdine();
                this.toastr.success("Ordine stampato!");
            }
            else
                this.toastr.error("Qualcosa è andato storto, contattare l'amministratore");

        } 
        catch (error) {
            console.log(error)    
        }
    }

    reimpostaOrdine(){
        this.formInfoUtente.reset();
        this.openDialog()
        this.ordineService.reimpostaOrdine();
    }

}
