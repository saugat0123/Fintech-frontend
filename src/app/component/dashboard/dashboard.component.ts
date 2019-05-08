import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {BreadcrumbService} from '../../common/breadcrum/breadcrumb.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    title = 'Dashboard';
    loanType: any;
    loanList: any;

    constructor(
        private commonService: CommonService,
        private dataService: CommonDataService,
        private router: Router,
        private breadcrumbService: BreadcrumbService
    ) {
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.commonService.getByAll('v1/config/getAll').subscribe((response: any) => {
            this.loanList = response.detail;
        });
    }

    loan() {
        console.log(this.loanType);
        this.dataService.setData(this.loanType);
        this.router.navigate(['/home/loan']);
    }

}
