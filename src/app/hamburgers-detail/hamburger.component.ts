import { Component } from '@angular/core';
import { HamburgerService, Hamburger } from '../shared/hamburger.service';
import { HamburgerOptionsModalComponent } from './hamburger-options-modal/hamburger-options-modals.component';
import { MatDialog } from '@angular/material';
import { IHamburger } from '../shared/hamburger.model';

@Component({
    selector: 'hamburgers-details',
    templateUrl: './hamburger.component.html'
})
export class HamburgersDetailComponent{
    hamburgers: Array<IHamburger>;
    constructor(private hamburgerService: HamburgerService,
                private dialog: MatDialog){ }

    ngOnInit(){ 
        this.hamburgerService.getHamburgers().subscribe(
            (data: Hamburger) => {this.hamburgers = data.rows},
            (err: any) => console.log(err)
        );

        //this.hamburgers = this.route.snapshot.data['hamburgers'];
    }

    openOptionsDialog( hamburgerId: number, isMenu: boolean): void{
        const hamburger  = this.getHamburger(hamburgerId);
        const dialogRef = this.dialog.open(HamburgerOptionsModalComponent, {
            width: '500px',
            data: {
                objHamburger: hamburger,
                isMenu: isMenu
            }
        });
    }

    /**
     * Ritorna l'hamburger richiesto in base all'id
     * @param id idHamburger
     */
    getHamburger(id: number){
        return this.hamburgers.find(hamburger => hamburger.id == id);
    }
    
}

