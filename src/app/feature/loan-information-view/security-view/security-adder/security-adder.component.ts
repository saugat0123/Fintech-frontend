import {Component, Input, OnInit} from '@angular/core';

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

    constructor() {
    }

    ngOnInit() {
        this.selectedShareSecurityList = this.shareSecurityData;
        this.customerShareData = this.shareSecurityData.customerShareData;
    }

    removeShareSecurity(data) {
        const removeIndex = this.findShareSecurityIndex(data);
        this.customerShareData.splice(removeIndex, 1);
    }

    findShareSecurityIndex(data) {
        return this.customerShareData.indexOf(this.customerShareData.filter(d => d.id.toString() === data.id.toString())[0]);
    }
}
