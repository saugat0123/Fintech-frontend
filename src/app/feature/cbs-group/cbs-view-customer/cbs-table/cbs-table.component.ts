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
    totalApprovedLimit = 0;
    totalOutstandingLimit = 0;

    constructor(private cbsService: CbsGroupService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.customerInfo)) {
            this.cbsService.getAllByOblId(this.customerInfo.obligor).subscribe((res: any) => {
                this.list = res.detail;
                this.list.forEach(l => {
                    this.totalApprovedLimit = this.totalApprovedLimit + this.isNumber(l.jsonDataMap.ApprovedLimit);
                    this.totalOutstandingLimit = this.totalApprovedLimit + this.isNumber(l.jsonDataMap.OSPrincipal);
                });
            });
        }
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

}
