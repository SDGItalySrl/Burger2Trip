import { Component, Input } from '@angular/core';

@Component({
    selector:'hamburger-modal',
    templateUrl:'./hamburger-options-modal.component.html'
})

export class HamburgerOptionsModalComponent{
    @Input() name: string;
}