import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {Security} from '../../../loan/model/security';
import {CustomerLoanInformationComponent} from '../../../customer/component/customer-loan-information/customer-loan-information.component';

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
    securityData = {
        security: null,
        securityType: null,
        isEdit: null,
        isSiteVisit: null
    };

    constructor(private customerLoanInformation: CustomerLoanInformationComponent) {
    }

    ngOnInit() {
        if (this.customerInfo.securities.length > 0) {
            this.securities = this.customerInfo.securities;
        }

        this.customerLoanInformation.securities$.subscribe(value => {
                console.log('value in view security table', value);
                if (value.length > 0) {
                    this.securities = value;
                }
            }
        );
    }

    public onEdit(security: Security): void {
        this.securityData.security = security;
        this.securityData.securityType = security.securityType;
        this.securityData.isEdit = true;
        this.security.emit(this.securityData);
    }

    public onSiteVisitClick(security: Security): void {
        this.securityData.security = security;
        this.securityData.securityType = security.securityType;
        this.securityData.isEdit = true;
        this.securityData.isSiteVisit = true;
        this.securityForSiteVisit.emit(this.securityData);
    }

}
