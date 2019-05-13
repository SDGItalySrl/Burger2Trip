import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PrinterService } from '../shared/printer.service';
@Component({
    selector: 'stampaComanda-dialog',
    templateUrl: 'stampaComanda-dialog.html',
  })
  export class StampaComanda {
  
    constructor(public dialogRef: MatDialogRef<StampaComanda>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private printerService: PrinterService){}
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    stampa(){
        this.printerService.print(this.data);
    }
  
  }