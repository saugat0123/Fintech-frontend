import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-customer-form1',
    templateUrl: './customer-form.component.html',
    styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

    constructor(
        private router: Router
    ) {
    }

    ngOnInit() {
    }

}
