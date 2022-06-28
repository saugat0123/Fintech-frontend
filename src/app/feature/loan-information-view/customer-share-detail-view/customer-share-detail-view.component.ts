import {Component, Input, OnInit} from '@angular/core';
import {CustomerShareBatch} from '../../admin/modal/customer-share-batch';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Status} from '../../../@core/Status';

@Component({
    selector: 'app-customer-share-detail-view',
    templateUrl: './customer-share-detail-view.component.html',
    styleUrls: ['./customer-share-detail-view.component.scss']
})
export class CustomerShareDetailViewComponent implements OnInit {
    @Input() customerShareBatch: Array<CustomerShareBatch>;
    shareSecurityDetails: any;
    viewSecurity: boolean;
    singleSelectedData: any;

    constructor() {
    }

    ngOnInit() {
        const cusShareLen = !ObjectUtil.isEmpty(this.customerShareBatch) ?
            this.customerShareBatch.length : 0;
        if (cusShareLen >= 1) {
            this.viewSecurity = true;
            const filterData = this.customerShareBatch.filter((data) => data.status === Status.ACTIVE);
            this.singleSelectedData = filterData[filterData.length - 1];
            this.shareSecurityDetails = filterData[filterData.length - 1].shareSecurity;
        } else {
            this.viewSecurity = false;
        }
    }

}
