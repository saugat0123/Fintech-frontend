import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Status} from '../../../@core/Status';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class ProductModeService extends BaseService<ProductMode> {

    static URL = 'v1/product-mode';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    public isProductEnable(productName: string): boolean {
        const productMode: ProductMode[] = JSON.parse(LocalStorageUtil.getStorage().productMode);

        for (const pm of productMode) {
            if (pm.product === productName && pm.status === Status.ACTIVE) {
                return true;
            }
        }
        return false;
    }

    public getProductUtils() {
        const api = `${this.getApi()}`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }
    public getBankUtils() {
        const api = `${this.getApi()}/bankUtils`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    protected getApi(): string {
        return ProductModeService.URL;
    }
}

export class ProductMode {
    product: string;
    status: string;
}

export class ProductUtils {
    ACCOUNT: boolean;
    ELIGIBILITY: boolean;
    NEP_TEMPLATE: boolean;
    MEMO: boolean;
    LAS: boolean;
    OFFER_LETTER: boolean;
    DMS: boolean;
    nepTemplate: boolean;
    LOAN_APPROVAL_HIERARCHY_LEVEL: string;
    CAD_LITE_VERSION: boolean;
    CBS_ENABLE: boolean;
    FULL_CAD: boolean;
    CHECK_LIST_LITE_VERSION: boolean;

}

export class BankUtils {
    AFFILIATED_ID: string;
}
