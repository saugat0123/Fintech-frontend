import {Injectable} from '@angular/core';
import {LocalStorageUtil} from '../utils/local-storage-util';
import {ProductModeService, ProductUtils} from '../../feature/admin/service/product-mode.service';

@Injectable({
    providedIn: 'root'
})
export class ProductUtilService {
    productUtils: ProductUtils;

    constructor(private productModeService: ProductModeService,) {
    }

    async getProductUtil() {
        const storage = LocalStorageUtil.getStorage();
        await this.productModeService.getProductUtils().toPromise().then((response: any) => {
            storage.productUtil = response.detail;
            LocalStorageUtil.setStorage(storage);
            this.productUtils = storage.productUtil;
        }, error => {
            console.error(error);
        });
        return this.productUtils;
    }
}
