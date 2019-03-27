import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HamburgerService } from './hamburger.service';
import { HamburgerResolver } from './hamburger-resolver.service';
import { HamburgerOptionsModalComponent } from './hamburger-options-modal/hamburger-options-modals.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'hamburgers-details',
    templateUrl: './hamburger.component.html'
})
export class HamburgersDetailComponent{
    hamburgers: any[];
    constructor(private humburgerList: HamburgerService, 
                private humburgerResolver: HamburgerResolver,
                private route: ActivatedRoute,
                private dialog: MatDialog){ }

    ngOnInit(){ 
        this.hamburgers = this.route.snapshot.data['hamburgers'];
    }

    openOptionsDialog(): void{
        let dialogRef = this.dialog.open(HamburgerOptionsModalComponent, {
            width: '500px'
        });

        dialogRef.afterClosed().subscribe(result => { 
            console.log('The dialog was closed ', result);
        });
    }
}

