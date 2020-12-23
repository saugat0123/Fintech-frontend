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

    constructor(private cbsService: CbsGroupService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.customerInfo)) {
            this.cbsService.getAllByOblId(this.customerInfo.obligor).subscribe((res: any) => {
                this.list = res.detail;
            });
        }
    }

}
