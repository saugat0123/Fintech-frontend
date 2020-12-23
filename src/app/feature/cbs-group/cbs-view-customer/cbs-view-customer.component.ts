import {Component, Input, OnInit} from '@angular/core';
import {CbsGroupService} from '../service/cbs-group.service';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CbsGroup} from '../model/cbsGroup';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

@Component({
    selector: 'app-cbs-view-customer',
    templateUrl: './cbs-view-customer.component.html',
    styleUrls: ['./cbs-view-customer.component.scss']
})
export class CbsViewCustomerComponent implements OnInit {
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
