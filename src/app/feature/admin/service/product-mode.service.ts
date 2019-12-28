import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Status} from '../../../@core/Status';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';

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

  protected getApi(): string {
    return ProductModeService.URL;
  }
}

export class ProductMode {
  product: string;
  status: string;
}
