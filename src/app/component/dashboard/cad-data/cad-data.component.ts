import {Component, Input, OnInit} from '@angular/core';
import {RouteConst} from '../../../feature/credit-administration/model/RouteConst';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {RoleType} from '../../../feature/admin/modal/roleType';

@Component({
    selector: 'app-cad-data',
    templateUrl: './cad-data.component.html',
    styleUrls: ['./cad-data.component.scss']
})
export class CadDataComponent implements OnInit {
    @Input() customerApproveCountDto;

    offerRouteConst = RouteConst;
    legal = true;
    disbursement = true;
    offer = true;
    productUtils = LocalStorageUtil.getStorage();

    constructor() {
    }

    ngOnInit() {
        const local = LocalStorageUtil.getStorage();
        if (local.roleType === RoleType.CAD_LEGAL) {
            this.disbursement = false;
            this.offer = false;
        }
    }

}
