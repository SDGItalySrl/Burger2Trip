import { Component } from '@angular/core';

@Component({
    selector: 'nav-bar',
    templateUrl: './nav-bar.component.html',
    styles: [``]
})
export class NavbarComponent{
    links = [
        {
            label: 'Home' ,
            link: '/home',
            index: 0
        },
        {
            label: 'Menu' ,
            link: '/menu',
            index: 1
        },
        {
            label: 'Info' ,
            link: '/info',
            index: 2
        }

    ];
    activeLink = this.links[0];
}