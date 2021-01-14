import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '../../../../../../@core/service/common.service';
import {Insurance} from '../../../../../admin/modal/insurance';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-customer-insurance',
    templateUrl: './customer-insurance.component.html',
    styleUrls: ['./customer-insurance.component.scss']
})
export class CustomerInsuranceComponent implements OnInit {

    @Input()
    insuranceList: Array<Insurance>;

    constructor(public service: CommonService) {
    }

    ngOnInit() {
        if (ObjectUtil.isEmpty(this.insuranceList)) {
            this.insuranceList = [];
        }
    }


}
