import {Component, Input, OnInit} from '@angular/core';
import {CbsGroup} from '../../model/cbsGroup';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {CbsGroupService} from '../../service/cbs-group.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-cbs-table',
    templateUrl: './cbs-table.component.html',
    styleUrls: ['./cbs-table.component.scss']
})
export class CbsTableComponent implements OnInit {
    @Input()
    customerInfo: CustomerInfoData;
    list: Array<CbsGroup> = new Array<CbsGroup>();
    totalApprovedLimit;
    totalOutstandingLimit;


    constructor(private cbsService: CbsGroupService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.customerInfo)) {
            this.cbsService.getAllByOblId(this.customerInfo.obligor).subscribe((res: any) => {
                this.list = res.detail;
                this.totalApprovedLimit = this.additionByKey('ApprovedLimit');
                this.totalOutstandingLimit = this.additionByKey('OSPrincipal');
            });
        }
    }

    public additionByKey(key) {
        const total = this.list.filter(l => l.jsonDataMap[key]).map(k => k.jsonDataMap[key])
            .reduce((a, b) => parseFloat(this.isNumber(a)) + parseFloat(this.isNumber(b)), 0);
        const finalTotal = this.isNumber(total);
        return parseFloat(finalTotal).toFixed(8);

    }

    public isNumber(value) {
        if (ObjectUtil.isEmpty(value)) {
            return 0;
        }
        if (Number.isNaN(value)) {
            return 0;
        } else {
            return value;
        }

    }

    public twoDecimalDigit(value) {
        const number = this.isNumber(value);
        return parseFloat(number).toFixed(8);
    }

    Number(s: string) {
        return this.isNumber(s);
    }
}
