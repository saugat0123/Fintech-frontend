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
    selectedSecurityList: any;
    securityList: any;

    constructor(private nbDialogService: NbDialogService) {
    }

    ngOnInit() {
        console.log('security', JSON.parse(this.security));
        console.log('share security data', this.shareSecurityData);
        console.log('tagged securities', this.taggedShareSecurities);
    }

    removeShareSecurity(securit: any) {

    }

    openGuarantorDetailModal(securit: any) {

    }
}
