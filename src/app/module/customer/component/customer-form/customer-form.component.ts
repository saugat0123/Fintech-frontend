import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerBaseComponent} from '../customer-base/customer-base.component';
import {CustomerDataService} from '../../service/customer-data.service';

@Component({
    selector: 'app-customer-form1',
    templateUrl: './customer-form.component.html',
    styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit, DoCheck {

    private currentId: number;
    private finalId: number;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private customerDataService: CustomerDataService
    ) {
    }

    ngOnInit() {
        this.finalId = this.customerDataService.totalNavsCount;
    }

    ngDoCheck(): void {
        this.currentId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        if (this.currentId > this.finalId || this.currentId < 1) {
            this.router.navigate(['customer/open/1']);
        }
    }

}
