import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-remit-details',
    templateUrl: './remit-details.component.html',
    styleUrls: ['./remit-details.component.scss']
})
export class RemitDetailsComponent implements OnInit {

    constructor() {
    }

    @Input() loanHolder;
    remit: any;
    agentDetails: any;
    beneficiaryDetails: any;
    senderDetails: any;
    documentDetails: any;
    isNull = true;

    ngOnInit() {
        this.remit = this.loanHolder.remitCustomer;
        if (this.remit !== null || !ObjectUtil.isEmpty(this.remit)) {
            this.isNull = false;
            this.agentDetails = JSON.parse(this.remit.agentData);
            this.senderDetails = JSON.parse(this.remit.senderData);
            this.beneficiaryDetails = JSON.parse(this.remit.beneficiaryData);
            this.documentDetails = JSON.parse(this.remit.remitFilePathData);
        }
    }

    opendocument(filePath: any) {
        console.log('get file path', filePath);
        let fileName = filePath.fullpath;
        const link = document.createElement('a');
        link.href = fileName;
        link.target = '_blank';
        link.click();
    }
}
