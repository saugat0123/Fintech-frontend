import {Component, Input, OnInit} from '@angular/core';
import {CustomerInfoData} from '../../../../model/customerInfoData';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-summary-of-environemnt',
    templateUrl: './summary-of-environemnt.component.html',
    styleUrls: ['./summary-of-environemnt.component.scss']
})
export class SummaryOfEnvironemntComponent implements OnInit {

    @Input() customerInfo: CustomerInfoData;

    constructor() {
    }

    esrmData: any;

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.customerInfo.creditChecklist)) {
            this.esrmData = JSON.parse(this.customerInfo.creditChecklist.data);
        }
    }

}
