import {LoanConfigService} from './loan-config.service';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {LoanConfig} from '../../modal/loan-config';
import {Observable} from 'rxjs';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Injectable()
export class LoanConfigResolver {
    constructor(private service: LoanConfigService) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<LoanConfig> {
        if (ObjectUtil.isEmpty(route.paramMap.get('id'))) {
            return null;
        }
        return this.service.detail(Number(route.paramMap.get('id')));
    }
}
