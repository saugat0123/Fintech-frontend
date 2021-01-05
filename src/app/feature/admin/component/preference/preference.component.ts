import {Component, OnInit} from '@angular/core';
import {ProductUtils} from '../../service/product-mode.service';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ProductUtilService} from '../../../../@core/service/product-util.service';

@Component({
    selector: 'app-preference',
    templateUrl: './preference.component.html',
    styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent implements OnInit {

    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;

    constructor(private utilService: ProductUtilService) {
    }

    ngOnInit() {
        this.utilService.getProductUtil().then(r => {
            this.productUtils = r;
        });
    }

}
