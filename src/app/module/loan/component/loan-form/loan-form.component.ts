import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {LoanDataService} from '../../service/loan-data.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MsgModalComponent} from '../../../../common/msg-modal/msg-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbService} from '../../../../common/breadcrum/breadcrumb.service';

@Component({
    selector: 'app-loan-form',
    templateUrl: './loan-form.component.html',
    styleUrls: ['./loan-form.component.css']
})
export class LoanFormComponent implements OnInit {
    templateList = [{
        active: false,
        name: null,
        templateUrl: null
    }];
    id;
    selectedTab;
    nxtTab;
    previousTab;
    first = false;
    last = false;
    allId;
    nxtParameter = {
        url: null,
        name: null,
        index: null
    };
    previousParameter = {
        url: null,
        name: null,
        index: null
    };


    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private loanDataService: LoanDataService,
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private router: Router,
        private breadcrumbService: BreadcrumbService
    ) {
    }

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = {
                    loanId: null,
                    customerId: null
                };
                this.allId = paramsValue;
                this.id = this.allId.loanId;
            });
        this.commonService.getByAll('v1/config/get/' + this.id).subscribe((response: any) => {
            this.dataService.setLoanName(response.detail.name);
            this.dataService.setLoan(response.detail);
            this.dataService.setInitialDocument(response.detail.initial);
            this.dataService.setRenewDocument(response.detail.renew);
            this.templateList = response.detail.templateList;
            this.breadcrumbService.notify(response.detail.name);
            for (let i = 0; i < this.templateList.length; i++) {
                this.templateList[i].active = false;
            }
            if (this.templateList.length > 0) {
                this.templateList[0].active = true;
                this.selectTab(0, this.templateList[0].name);
                this.first = true;
            }
            if (this.templateList.length === 0) {
                this.router.navigate(['/home/dashboard']);
                this.dataService.getGlobalMsg('NO FORM ARE AVAILABLE');
                this.modalService.open(MsgModalComponent);

            }
        });

    }

    selectTab(index, name) {
        for (let i = 0; i < this.templateList.length; i++) {
            this.templateList[i].active = false;
        }
        this.templateList[index].active = true;
        this.selectedTab = name;
        if (index !== 0) {
            this.loanDataService.setPrevious(index - 1, this.templateList[index - 1].templateUrl, this.templateList[index - 1].name);
            this.previousTab = this.templateList[index - 1].templateUrl;
            this.first = false;
        } else {
            this.first = true;
        }
        if (((index + 1) < this.templateList.length)) {
            this.loanDataService.setNext(index + 1, this.templateList[index + 1].templateUrl, this.templateList[index + 1].name);
            this.nxtTab = this.templateList[index + 1].templateUrl;
            this.last = false;
        } else {
            this.last = true;
        }


    }

    nextTab() {
        console.log(this.loanDataService.getLoanDocuments());
        this.nxtParameter = this.loanDataService.getNext();
        this.selectTab(this.nxtParameter.index, this.nxtParameter.name);

    }

    prevTab() {
        this.previousParameter = this.loanDataService.getPrevious();
        this.selectTab(this.previousParameter.index, this.previousParameter.name);
    }

    save() {
        console.log(this.loanDataService.getLoanDocuments());
    }

}
