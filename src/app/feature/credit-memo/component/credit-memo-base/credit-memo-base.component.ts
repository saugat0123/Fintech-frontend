import {Component, OnInit} from '@angular/core';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';

@Component({
    selector: 'app-credit-memo-base',
    templateUrl: './credit-memo-base.component.html',
    styleUrls: ['./credit-memo-base.component.scss']
})
export class CreditMemoBaseComponent implements OnInit {
    isMaker = false;

    constructor() {
    }

    ngOnInit() {
        if (LocalStorageUtil.getStorage().roleType === 'MAKER') {
            this.isMaker = true;
        }
    }
}
