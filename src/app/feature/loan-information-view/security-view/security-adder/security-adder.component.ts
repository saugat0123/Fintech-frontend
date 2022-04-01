import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'app-security-adder',
    templateUrl: './security-adder.component.html',
    styleUrls: ['./security-adder.component.scss']
})
export class SecurityAdderComponent implements OnInit {

    @Input() security;
    @Input() shareSecurityData;
    @Input() taggedShareSecurities;
    customerShareData: any;
    selectedShareSecurityList: any;
    securityList: any;
    msg = '';
    approvedShareSecurity: any;
    @Output() saveShareSecurity = new EventEmitter();


    shareSecurity = new FormControl(undefined, Validators.required);

    constructor() {
    }

    ngOnInit() {
        this.customerShareData = this.shareSecurityData.customerShareData;
        this.approvedShareSecurity = JSON.parse(this.shareSecurityData.approvedData).shareSecurityDetails;
    }

    removeShareSecurity(data) {
        const removeIndex = this.findShareSecurityIndex(data);
        this.approvedShareSecurity.splice(removeIndex, 1);
    }

    findShareSecurityIndex(data) {
        return this.approvedShareSecurity.indexOf(this.approvedShareSecurity.filter(
            d => d.totalShareUnit.toString() === data.totalShareUnit.toString() && d.companyName === data.companyName)[0]);
    }

    addSecurityDetail(data) {
        const presentShareSecurity = this.approvedShareSecurity.filter(d => d.id === data.id);
        if (presentShareSecurity.length <= 0) {
            this.approvedShareSecurity.push(data);
            this.msg = '';
        } else {
            this.msg = 'selected share security is already added !';
        }
    }

    save() {
        this.saveShareSecurity.emit(this.approvedShareSecurity);
    }
}
