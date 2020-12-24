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


    constructor() {
    }

    ngOnInit() {

    }

}
