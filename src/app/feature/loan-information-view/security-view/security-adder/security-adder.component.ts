import {Component, Input, OnInit} from '@angular/core';
import {NbDialogService} from '@nebular/theme';

@Component({
    selector: 'app-security-adder',
    templateUrl: './security-adder.component.html',
    styleUrls: ['./security-adder.component.scss']
})
export class SecurityAdderComponent implements OnInit {

    @Input() security;
    @Input() shareSecurityData;
    @Input() taggedShareSecurities;
    msg = '';
    approvedSecurityData: any;
    approvedShareSecurityData: any;
    customerShareData: any;
    // selectedSecurityList: any;
    securityList: any;

    constructor(private nbDialogService: NbDialogService) {
    }

    ngOnInit() {
        console.log('security', this.security);
        if (this.security.approvedData) {
            this.approvedSecurityData = JSON.parse(this.security.approvedData);
            console.log('approved security data', this.approvedSecurityData);
        }
        if (this.shareSecurityData.approvedData) {
            this.approvedShareSecurityData = JSON.parse(this.shareSecurityData.approvedData);
            console.log('approved share security data', this.approvedShareSecurityData);
        }
        this.customerShareData = this.shareSecurityData.customerShareData;
        console.log('customer share data', this.customerShareData);
        console.log('share security data', this.shareSecurityData);
        console.log('tagged securities', this.taggedShareSecurities);
    }

    removeShareSecurity(shareSecurity: any) {
        console.log('remove share security', shareSecurity);
    }

    openShareSecurityDetailModal(shareSecurity: any) {
        console.log('open share security details', shareSecurity);
    }
}
