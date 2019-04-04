import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HamburgerService } from '../shared/hamburger.service';
import { HamburgerOptionsModalComponent } from './hamburger-options-modal/hamburger-options-modals.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'hamburgers-details',
    templateUrl: './hamburger.component.html'
})
export class HamburgersDetailComponent{
    hamburgers: any[];
    constructor(private hamburgerList: HamburgerService,
                private route: ActivatedRoute,
                private dialog: MatDialog){ }

    ngOnInit(){ 
        this.hamburgers = this.route.snapshot.data['hamburgers'];
    }

    openOptionsDialog( hamburgerId: number, isMenu: boolean): void{
        const hamburger  = this.hamburgerList.getHamburger(hamburgerId);
        const dialogRef = this.dialog.open(HamburgerOptionsModalComponent, {
            width: '500px',
            data: {
                objHamburger: hamburger,
                isMenu: isMenu
            }
        });
    }
    
}

