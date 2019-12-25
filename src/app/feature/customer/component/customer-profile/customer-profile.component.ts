import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-customer-profile',
    templateUrl: './customer-profile.component.html',
    styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        alert(this.route.snapshot.params.id);
    }

}
