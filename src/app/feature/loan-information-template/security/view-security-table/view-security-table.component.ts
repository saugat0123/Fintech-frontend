import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {Security} from '../../../loan/model/security';

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
    securityData = {
        security: null,
        securityType: null,
        isEdit: null
    };

    constructor() {
    }

    ngOnInit() {
        if (this.customerInfo.securities.length > 0) {
            this.securities = this.customerInfo.securities;
        }
    }

    public onEdit(security: Security): void {
        this.securityData.security = security;
        this.securityData.securityType = security.securityType;
        this.securityData.isEdit = true;
        this.security.emit(this.securityData);
    }

}
