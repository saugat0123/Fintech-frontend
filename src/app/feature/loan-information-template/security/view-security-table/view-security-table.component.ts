import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {Security} from '../../../loan/model/security';
import {CustomerLoanInformationComponent} from '../../../customer/component/customer-loan-information/customer-loan-information.component';
import {SecurityLoanReferenceService} from '../../../security-service/security-loan-reference.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Status} from '../../../../@core/Status';

@Component({
    selector: 'app-view-security-table',
    templateUrl: './view-security-table.component.html',
    styleUrls: ['./view-security-table.component.scss']
})
export class ViewSecurityTableComponent implements OnInit {
    @Input() customerInfo: CustomerInfoData;
    securities: Array<Security> = new Array<Security>();
    regex = /_/g;
    @Output() security: EventEmitter<Object> = new EventEmitter<Object>();
    @Output() securityForSiteVisit: EventEmitter<Object> = new EventEmitter<Object>();
    toggleArray: { toggled: boolean, security: any, securityPresent: boolean, approved: boolean }[] = [];
    spinner = false;
    securityData = {
        security: null,
        securityType: null,
        isEdit: null,
        isSiteVisit: null,
        status: Status.ACTIVE,
    };

    constructor(private customerLoanInformation: CustomerLoanInformationComponent,
                private securityLoanReferenceService: SecurityLoanReferenceService) {
    }

    ngOnInit() {
        if (this.customerInfo.securities.length > 0) {
            this.securities = this.customerInfo.securities.filter((d) => d.status.toString() === 'ACTIVE');
            this.securities.forEach((d, i) => {
                this.toggleArray.push({ toggled: false, security: null, securityPresent: false, approved: false});
                this.getSecurityDetails(d.id, i);
            });
        }

        this.customerLoanInformation.securities$.subscribe(value => {
                if (value.length > 0) {
                    this.securities = value;
                }
            }
        );
    }

    public onEdit(security: Security, status?: any): void {
        if (!ObjectUtil.isEmpty(status)) {
            this.securityData.status = Status.INACTIVE;
            security.status = Status.INACTIVE;
        }
        this.securityData.security = security;
        this.securityData.securityType = security.securityType;
        this.securityData.isEdit = true;
        this.securityData.isSiteVisit = false;
        this.security.emit(this.securityData);
    }

    public onSiteVisitClick(security: Security): void {
        this.securityData.security = security;
        this.securityData.securityType = security.securityType;
        this.securityData.isEdit = false;
        this.securityData.isSiteVisit = true;
        this.securityForSiteVisit.emit(this.securityData);
    }

    public getSecurityDetails(id, i): void {
        this.spinner = true;
        this.securityLoanReferenceService.getAllSecurityLoanReferences(Number(id)).subscribe(res => {
            this.spinner = false;
            this.toggleArray[i].security = res.detail;
            this.checkContainedApprovedLoan(res.detail, i);
            this.toggleArray[i].securityPresent = this.toggleArray[i].security.length > 0;
        }, (err) => {
            this.spinner = false;
        });
    }

    public checkContainedApprovedLoan(detail: any, idx: number): void {
        let counter = 0;
        detail.forEach(f => {
            if (f.customerLoan.documentStatus === 'APPROVED') {
                counter++;
            }
        });
        if (counter === detail.length && counter > 1) {
            this.toggleArray[idx].approved = true;
        }
    }

}
